import json
import os
import re
import uuid
import webbrowser
from importlib import resources


def _extract_tool_description(tool) -> str:
    tool_description = re.search(
        r"Tool Description: (.*)", tool.description, re.DOTALL)
    return tool_description.group(1)


def _extract_task_variables(task) -> list[str]:
    """Variables starts with { and ends with }"""
    variable_regex = r"\{(.+?)\}"
    to_return = []
    text = '\n'.join([task.description, task.expected_output])
    for match in re.finditer(variable_regex, text):
        to_return.append(match.group(1))

    return to_return


def _extract_agent_variables(agent) -> list[str]:
    """Variables starts with { and ends with }"""
    variable_regex = r"\{(.+?)\}"
    to_return = []
    text = '\n'.join([agent.role, agent.goal, agent.backstory])
    for match in re.finditer(variable_regex, text):
        to_return.append(match.group(1))

    return to_return


def _create_crew_ai_json(crew):
    tool_y = -300
    agent_y = -200
    graph_nodes = []
    graph_edges = []

    variables = []

    for agent in crew.agents:
        tool_nodes = []
        for tool in agent.tools:
            tool_nodes.append({
                "id": str(uuid.uuid4()),
                "type": "tool",
                "data": {
                    "name": tool.name,
                    "description": _extract_tool_description(tool)
                }
            })
            tool_y += 300

        agent_node = {
            "id": str(agent.id),
            "type": "agent",
            "data": {
                "role": agent.role,
                "goal": agent.goal,
                "backstory": agent.backstory
            }
        }

        variables.extend(_extract_agent_variables(agent))
        agent_y += 200
        for tool in tool_nodes:
            graph_edges.append({
                "id": str(uuid.uuid4()),
                "source": agent_node["id"],
                "target": tool["id"],
                "animated": False,
                "sourceHandle": "out",
                "targetHandle": "in",
                "style": {
                    "stroke": "#3b82f6",
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "ArrowClosed",
                    "color": "#3b82f6"
                }
            })
        graph_nodes.append(agent_node)
        graph_nodes.extend(tool_nodes)

    for idx, task in enumerate(crew.tasks):
        task_node = {
            "id": str(task.id),
            "type": "task",
            "data": {
                "name": task.name,
                "description": task.description,
                "expected_output": task.expected_output,
                "output_file": task.output_file
            }
        }

        variables.extend(_extract_task_variables(task))
        graph_nodes.append(task_node)
        if task.agent:
            graph_edges.append({
                "id": str(uuid.uuid4()),
                "source": str(task.agent.id),
                "target": task_node["id"],
                "animated": False,
                "sourceHandle": "in",
                "targetHandle": "out",
                "style": {
                    "stroke": "#3b82f6",
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "ArrowClosed",
                    "color": "#3b82f6"
                }
            })
        if idx > 0:
            graph_edges.append({
                "id": str(uuid.uuid4()),
                "source": str(crew.tasks[idx - 1].id),
                "target": str(task.id),
                "animated": True,
                "sourceHandle": "right",
                "targetHandle": "left",
                "style": {
                    "stroke": "#3b82f6",
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "ArrowClosed",
                    "color": "#3b82f6"
                }
            })
    agent_dict = {
        "nodes": graph_nodes,
        "edges": graph_edges
    }
    variables = list(set(variables))
    input_node = {
        "id": str(uuid.uuid4()),
        "type": "agentInput",
        "is_starting_node": True,
        "data": {
            "name": "User input",
            "variables": variables
        }
    }
    graph_nodes.append(input_node)
    if any(crew.tasks):
        graph_edges.append({
            "id": str(uuid.uuid4()),
            "target": str(crew.tasks[0].id),
            "source": input_node["id"],
            "animated": True,
            "sourceHandle": "right",
            "targetHandle": "left",
            "style": {
                "stroke": "#3b82f6",
            }})
    else:
        graph_edges.append({
            "id": str(uuid.uuid4()),
            "target": str(crew.agents[0].id),
            "source": input_node["id"],
            "animated": True,
            "sourceHandle": "right",
            "targetHandle": "left",
            "style": {
                "stroke": "#3b82f6",
            }})

    return agent_dict


def _render_crew_ai_html(crew_ai_dict, path):
    with resources.path('ai_trace.assets', 'index.html') as index_path:
        with open(index_path, 'r') as f:
            html = f.read()
    html = html.replace('const CREW_AI_WORKFLOW = {};', f'const CREW_AI_WORKFLOW = {json.dumps(crew_ai_dict)};')
    with open(path, 'w') as f:
        f.write(html)


def view_crew(crew):

    agent_dict = _create_crew_ai_json(crew)
    path = f'crew_ai-{uuid.uuid4()}.html'
    # Get absolute path
    path = os.path.abspath(path)
    _render_crew_ai_html(agent_dict, path)
    webbrowser.open('file://' + path)


def save_view(crew, path):
    agent_dict = _create_crew_ai_json(crew)
    _render_crew_ai_html(agent_dict, path)
