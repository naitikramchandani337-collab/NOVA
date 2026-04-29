# Kiro Workflow Guide for NOVA Development

This guide explains how to work efficiently with Kiro to build the NOVA platform.

---

## 🎯 Overview

NOVA is built in phases using Kiro. Each phase focuses on specific features. This guide helps you work with Kiro effectively.

---

## 📋 Pre-Development Checklist

Before starting any development:

- [ ] Read the relevant spec in `.kiro/specs/`
- [ ] Review `.kiro/steering.md` for code standards
- [ ] Understand the feature requirements
- [ ] Check the implementation order
- [ ] Identify dependencies

---

## 🚀 Development Workflow

### Step 1: Understand the Feature

**Read the Spec**
- Open `.kiro/specs/[feature].md`
- Understand visual design
- Understand interactions
- Understand technical requirements

**Example**: Building Gradient Descent visualization
- Read `.kiro/specs/visualizations.md`
- Find "Gradient Descent Mountain" section
- Review all requirements

### Step 2: Create a Kiro Prompt

**Use This Template**:
```
Build [Feature Name] per .kiro/specs/[spec-file].md

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Technical:
- Use [Library]
- Target [Performance]
- Dark theme (#050510)
- Responsive design

Connect to:
- [Store/Context]
- [API endpoint]
```

**Example Prompt**:
```
Build the Gradient Descent visualization per .kiro/specs/visualizations.md

Requirements:
- 3D mountain terrain using Three.js
- Orange glowing ball on surface
- PLAY button to animate descent
- Learning rate slider (0.001 to 0.9)
- Show current loss and steps taken
- Responsive to window resize

Technical:
- Use Three.js for 3D rendering
- Target 60fps animation
- Dark theme (#050510 background)
- Responsive to mobile/tablet/desktop

Connect to:
- useVisualizationStore for state
- POST /api/visualizations/gradient-descent for backend
```

### Step 3: Review Kiro's Output

**Check Against Spec**:
- [ ] Visual design matches spec
- [ ] All interactions implemented
- [ ] Animations smooth (60fps)
- [ ] Dark theme applied
- [ ] Responsive design works
- [ ] TypeScript types correct
- [ ] Code follows steering.md

**If Issues Found**:
- Ask Kiro to fix specific issues
- Reference the spec requirement
- Provide exact feedback

**Example**:
```
The learning rate slider needs to go from 0.001 to 0.9 per spec.
Currently it's 0 to 1. Please fix the slider range.
```

### Step 4: Test the Feature

**Manual Testing**:
- [ ] Feature renders without errors
- [ ] All interactions work
- [ ] Animations smooth
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark theme applied
- [ ] No console errors

**Integration Testing**:
- [ ] Connects to correct store
- [ ] Calls correct API endpoint
- [ ] Handles errors gracefully
- [ ] Updates UI on state change

### Step 5: Iterate

**Ask for Improvements**:
```
Make the star parallax smoother by increasing the parallax factor.
Add a glow effect to the rocket when it's selected.
Make the loss curve animation 2x faster.
```

**Refine Based on Feedback**:
- Test changes
- Verify against spec
- Commit when satisfied

---

## 📅 Daily Workflow Example

### Day 1: Setup & Space Environment

**Morning**:
1. Read `.kiro/specs/visualizations.md` (Gradient Descent section)
2. Create Kiro prompt for Gradient Descent
3. Review Kiro's output
4. Test in browser

**Afternoon**:
1. Ask Kiro to add learning rate slider
2. Ask Kiro to add loss display
3. Test interactions
4. Commit code

### Day 2: Rocket System

**Morning**:
1. Read `.kiro/specs/nova-build.md` (Rocket section)
2. Create Kiro prompt for Rocket component
3. Review Kiro's output
4. Test part reveal animation

**Afternoon**:
1. Connect to progressStore
2. Test phase completion trigger
3. Refine animations
4. Commit code

### Day 3: Gamification

**Morning**:
1. Read `.kiro/specs/gamification.md` (XP section)
2. Create Kiro prompt for XP system
3. Review Kiro's output
4. Test XP calculations

**Afternoon**:
1. Build level system
2. Build badge system
3. Connect to UI
4. Commit code

---

## 💡 Kiro Tips That Will Save You

### Tip 1: Be Specific

**Bad Prompt**:
```
Build the rocket
```

**Good Prompt**:
```
Build the Rocket component using Three.js with 10 separate meshes.
Each part is controlled by rocketStore (Zustand).
When a new part is added, it flies in from the right with a particle burst.
The rocket sits fixed on the right side of screen.
```

### Tip 2: One Component at a Time

Don't ask for everything at once:

**Bad**:
```
Build the entire gamification system with XP, levels, badges, and streaks.
```

**Good**:
```
Build the XP system per .kiro/specs/gamification.md

Requirements:
- XP bar at top of screen
- XP notifications that float up
- XP calculations per action type
- Store XP in useGamificationStore
```

Then ask for levels, badges, streaks separately.

### Tip 3: Reference Specs Before Code

Always check the spec before asking Kiro to code:

**Bad**:
```
Build a visualization for gradient descent.
```

**Good**:
```
Build the Gradient Descent visualization per .kiro/specs/visualizations.md

[Include specific requirements from spec]
```

### Tip 4: Use Steering File

The `.kiro/steering.md` file keeps all code consistent:

**Reference in Prompts**:
```
Follow .kiro/steering.md for:
- Always use dark theme (#050510)
- Always use Zustand for state
- Always use TypeScript
- Space theme in component names
```

### Tip 5: Iterate Fast

Get it working first, then improve:

**First Iteration**:
```
Build the loss curve visualization with basic D3.js chart.
```

**Second Iteration**:
```
Add WebSocket connection to stream live training data.
```

**Third Iteration**:
```
Add animation for curve drawing point by point.
```

### Tip 6: Connect Things Explicitly

Kiro needs explicit connections:

**Bad**:
```
Build the rocket and connect it to progress.
```

**Good**:
```
Build the Rocket component.
Connect to useProgressStore.
When progressStore.completedPhases changes, reveal the corresponding rocket part.
Use rocketStore to manage which parts are visible.
```

### Tip 7: Test Before Committing

Always test Kiro's output:

**Checklist**:
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Feature works as specified
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark theme applied
- [ ] Animations smooth (60fps)
- [ ] Follows steering.md standards

---

## 🔄 Feedback Loop

### When Kiro's Output Doesn't Match Spec

**Step 1**: Identify the mismatch
```
The learning rate slider should go from 0.001 to 0.9 per spec.
Currently it's 0 to 1.
```

**Step 2**: Ask Kiro to fix
```
Fix the learning rate slider range to 0.001 to 0.9 per spec.
```

**Step 3**: Test the fix
```
Test that slider now goes from 0.001 to 0.9.
```

**Step 4**: Commit when satisfied
```
git commit -m "Fix learning rate slider range"
```

### When Spec Needs Clarification

**Step 1**: Identify the unclear requirement
```
The spec says "smooth 60fps animation" but doesn't specify easing function.
```

**Step 2**: Ask Kiro for recommendation
```
What easing function would you recommend for the ball rolling animation?
```

**Step 3**: Update spec if needed
```
Update .kiro/specs/visualizations.md to specify easing: "easeInOut"
```

---

## 📊 Progress Tracking

### Track What's Done

Use the checklist in `.kiro/specs/README.md`:

```markdown
| Feature | Spec File | Status |
|---------|-----------|--------|
| Gradient Descent Viz | visualizations.md | ✅ Complete |
| Loss Curve Viz | visualizations.md | 🚧 In Progress |
| Neural Network Firing Viz | visualizations.md | ⬜ Not Started |
```

### Update as You Go

- ✅ Complete: Feature done and tested
- 🚧 In Progress: Currently working on
- ⬜ Not Started: Not yet started

---

## 🎯 Common Scenarios

### Scenario 1: Building a Visualization

1. Read `.kiro/specs/visualizations.md`
2. Find the visualization section
3. Create detailed Kiro prompt with all requirements
4. Review output against spec
5. Test interactions and animations
6. Iterate on improvements
7. Commit when complete

### Scenario 2: Building a UI Component

1. Read `.kiro/specs/gamification.md` or relevant spec
2. Understand the UI layout
3. Create Kiro prompt with layout requirements
4. Review output
5. Connect to store/context
6. Test state management
7. Iterate on styling
8. Commit when complete

### Scenario 3: Building Backend Integration

1. Read spec for API requirements
2. Create Kiro prompt for backend endpoint
3. Review output
4. Test endpoint with frontend
5. Handle errors gracefully
6. Add logging/monitoring
7. Commit when complete

---

## 🚨 Common Issues & Solutions

### Issue: Kiro Generates Code That Doesn't Match Spec

**Solution**:
1. Point out the specific mismatch
2. Reference the spec requirement
3. Ask Kiro to fix
4. Test the fix

**Example**:
```
The spec requires the ball to be orange/red glowing.
Your code uses blue. Please change to orange (#ff6b35) with glow effect.
```

### Issue: Animations Are Janky

**Solution**:
1. Check if using `requestAnimationFrame`
2. Check if using `transform` instead of `left/top`
3. Ask Kiro to optimize
4. Profile with DevTools

**Example**:
```
The animation is janky. Use transform instead of left/top for better performance.
Also use requestAnimationFrame for smooth 60fps.
```

### Issue: Component Doesn't Connect to Store

**Solution**:
1. Check store is created
2. Check component imports store
3. Check store is used correctly
4. Ask Kiro to fix connection

**Example**:
```
The component isn't updating when the store changes.
Make sure to use useVisualizationStore() hook and subscribe to state changes.
```

---

## 📚 Resources

### Documentation
- `.kiro/steering.md` - Code standards
- `.kiro/specs/` - Feature specifications
- `IMPLEMENTATION_GUIDE.md` - Setup guide
- `ARCHITECTURE.md` - System design

### External Resources
- [Three.js Documentation](https://threejs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
- [D3.js Documentation](https://d3js.org)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

---

## ✅ Pre-Commit Checklist

Before committing code:

- [ ] Feature matches spec requirements
- [ ] TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark theme applied
- [ ] Animations smooth (60fps)
- [ ] Follows steering.md standards
- [ ] Tests pass (if applicable)
- [ ] Code is commented
- [ ] Commit message is clear

---

## 🎓 Learning Path

### Week 1: Foundations
- [ ] Read all specs
- [ ] Understand steering.md
- [ ] Build first visualization
- [ ] Get comfortable with Kiro workflow

### Week 2: Visualizations
- [ ] Build all 7 visualizations
- [ ] Test each one
- [ ] Refine based on feedback

### Week 3: NOVA Build System
- [ ] Build code reveal system
- [ ] Build code panel
- [ ] Build status panel
- [ ] Build browser execution

### Week 4: Gamification
- [ ] Build XP system
- [ ] Build level system
- [ ] Build badge system
- [ ] Build streak system

---

## 🚀 Ready to Start?

1. Read `.kiro/steering.md`
2. Read `.kiro/specs/README.md`
3. Pick a feature from the implementation order
4. Read the corresponding spec
5. Create a Kiro prompt
6. Follow the workflow above
7. Iterate until complete
8. Commit and move to next feature

---

**Last Updated**: April 17, 2026
**Version**: 1.0.0
**Status**: Ready for development
