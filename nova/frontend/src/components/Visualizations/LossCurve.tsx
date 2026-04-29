import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface LossCurveProps {
  onComplete?: () => void;
}

export const LossCurve: React.FC<LossCurveProps> = ({ onComplete }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [lossData, setLossData] = useState<{ epoch: number; loss: number }[]>([]);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setEpoch((prev) => {
        const newEpoch = prev + 1;

        // Simulate loss curve: exponential decay with noise
        const baseLoss = Math.exp(-newEpoch * 0.1) + 0.1;
        const noise = (Math.random() - 0.5) * 0.05;
        const loss = Math.max(0.1, baseLoss + noise);

        setLossData((prev) => [...prev, { epoch: newEpoch, loss }]);

        if (newEpoch >= 50) {
          setIsTraining(false);
          onComplete?.();
        }

        return newEpoch;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTraining, onComplete]);

  useEffect(() => {
    if (!svgRef.current || lossData.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(50, d3.max(lossData, (d) => d.epoch) || 0)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // Add grid
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => '')
      );

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('fill', '#a8b5ff')
      .attr('text-anchor', 'middle')
      .text('Epoch');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .attr('fill', '#a8b5ff')
      .attr('text-anchor', 'middle')
      .text('Loss');

    // Add line path
    const line = d3
      .line<{ epoch: number; loss: number }>()
      .x((d) => xScale(d.epoch))
      .y((d) => yScale(d.loss));

    svg
      .append('path')
      .datum(lossData)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    svg
      .selectAll('.dot')
      .data(lossData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.epoch))
      .attr('cy', (d) => yScale(d.loss))
      .attr('r', 3)
      .attr('fill', '#ff6b35')
      .attr('opacity', 0.7);
  }, [lossData]);

  const handleInjectNoise = () => {
    setLossData((prev) => [
      ...prev,
      {
        epoch: prev.length + 1,
        loss: Math.random() * 0.5 + 0.3,
      },
    ]);
  };

  return (
    <div className="w-full space-y-4">
      <svg
        ref={svgRef}
        className="w-full h-96 bg-space-900 rounded-lg border border-space-800"
        style={{ backgroundColor: '#0a0e27' }}
      />

      <div className="space-y-4 bg-space-900 p-4 rounded-lg border border-space-800">
        {/* Training Status */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-space-800 p-2 rounded">
            <p className="text-space-400">Epoch</p>
            <p className="text-rocket-primary font-bold">{epoch}</p>
          </div>
          <div className="bg-space-800 p-2 rounded">
            <p className="text-space-400">Current Loss</p>
            <p className="text-rocket-primary font-bold">
              {lossData.length > 0 ? lossData[lossData.length - 1].loss.toFixed(4) : '—'}
            </p>
          </div>
          <div className="bg-space-800 p-2 rounded">
            <p className="text-space-400">Status</p>
            <p className={`font-bold ${isTraining ? 'text-yellow-400' : 'text-green-400'}`}>
              {isTraining ? 'Training...' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setIsTraining(!isTraining)}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              isTraining
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-rocket-primary hover:bg-rocket-secondary text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={epoch >= 50}
          >
            {isTraining ? 'PAUSE' : 'TRAIN'}
          </motion.button>
          <motion.button
            onClick={() => {
              setLossData([]);
              setEpoch(0);
              setIsTraining(false);
            }}
            className="flex-1 py-2 bg-space-800 hover:bg-space-700 text-space-200 rounded-lg font-bold transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RESET
          </motion.button>
          <motion.button
            onClick={handleInjectNoise}
            className="flex-1 py-2 bg-space-800 hover:bg-space-700 text-space-200 rounded-lg font-bold transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            NOISE
          </motion.button>
        </div>

        {/* Explanation */}
        <div className="text-xs text-space-400 bg-space-800 p-2 rounded">
          <p className="font-bold text-space-300 mb-1">What you're seeing:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Loss decreases as model learns</li>
            <li>Noise simulates real training variance</li>
            <li>Goal: reach minimum loss</li>
            <li>Smooth curve = good learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
