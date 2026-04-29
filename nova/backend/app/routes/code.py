import subprocess
import sys
import tempfile
import os
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CodeRunRequest(BaseModel):
    code: str
    language: str = "python"


class CodeRunResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


@router.post("/run", response_model=CodeRunResponse)
async def run_code(body: CodeRunRequest):
    """
    Execute Python code safely using a subprocess with timeout.
    No auth required — code runs in an isolated process.
    """
    if body.language != "python":
        return CodeRunResponse(
            stdout="",
            stderr=f"Language '{body.language}' is not supported. Only Python is available.",
            exit_code=1,
        )

    # Write code to a temp file
    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".py",
        delete=False,
        encoding="utf-8",
    ) as f:
        f.write(body.code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=10,          # 10-second hard limit
            cwd=tempfile.gettempdir(),
        )
        return CodeRunResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.returncode,
        )
    except subprocess.TimeoutExpired:
        return CodeRunResponse(
            stdout="",
            stderr=(
                "⏱️ Execution timed out (10s limit).\n\n"
                "Your code may have an infinite loop. Check for:\n"
                "  • while True: without a break\n"
                "  • Recursive functions without a base case\n"
                "  • Very large computations"
            ),
            exit_code=1,
        )
    except Exception as e:
        return CodeRunResponse(
            stdout="",
            stderr=f"Execution error: {str(e)}",
            exit_code=1,
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
