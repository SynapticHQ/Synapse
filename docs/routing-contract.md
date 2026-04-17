# Agent Routing Contract

Synapse routes tasks to specialized agents, so the hand-off format matters more than any single prompt. This note keeps the contract explicit.

## A routed task must include

- One clear objective.
- The minimum context needed to solve it.
- A deadline or latency class.
- The expected return shape, such as answer, action list, or artifact.

## The gateway should avoid

- Sending broad research prompts to execution agents.
- Hiding hard constraints inside long background notes.
- Asking two agents for overlapping ownership of the same action.

## Success condition

The receiving agent should be able to answer three questions immediately: what am I solving, what context is binding, and what form must my output take.
