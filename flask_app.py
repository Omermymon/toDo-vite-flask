from flask import Flask, request, jsonify, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])
todos = []
next_id = 1

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos), 200

@app.route('/todos', methods=['POST'])
def create_todo():
    global next_id
    if not request.is_json:
        abort(400, description="Request must be JSON")
    data = request.get_json()
    if 'task' not in data or not isinstance(data['task'], str):
        abort(400, description="Task (string) is required")
    todo = {"id": next_id, "task": data['task'], "done": False}
    todos.append(todo)
    next_id += 1
    return jsonify(todo), 201

@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = next((t for t in todos if t["id"] == todo_id), None)
    if not todo:
        abort(404, description="Todo not found")
    return jsonify(todo), 200

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = next((t for t in todos if t["id"] == todo_id), None)
    if not todo:
        abort(404, description="Todo not found")
    if not request.is_json:
        abort(400, description="Request must be JSON")
    data = request.get_json()

    if 'task' in data:
        if not isinstance(data['task'], str):
            abort(400, description="Task must be a string")
        todo['task'] = data['task']
    if 'done' in data:
        todo['done'] = bool(data['done'])

    return jsonify(todo), 200

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    if not any(t["id"] == todo_id for t in todos):
        abort(404, description="Todo not found")
    todos = [t for t in todos if t["id"] != todo_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
