import '../styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import TodoItem from '../components/TodoItem'
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { incrementTodoCount, changeTodoCount, decrementTodoCount, fetchTodoGlobal} from '../redux/actions/todo'


class TodoPage extends React.Component {
  state = {
    todoList: [],
    inputTodo: ""
  }

  fetchTodo = () => {
    Axios.get("http://localhost:2000/todo")
    .then((response) => {
      console.log(response.data);
      this.setState({todoList: response.data})
      this.props.changeTodo(response.data.length)
    })
    .catch((err) => {
      alert("Terjadi kesalahan di server")
    })
  }

  deleteTodo = (id) => {
    Axios.delete(`http://localhost:2000/todo/${id}`)
    .then(() => {
      alert("Berhasil menghapus todo")
      this.props.fetchTodoGlobal()
    })
    .catch((err) => {
      alert("Terjadi kesalahan di server")
    })
  }

  completeTodo = (id) => {
    Axios.patch(`http://localhost:2000/todo/${id}`, {
      isFinished: true
    })
    .then(() => {
      alert("Berhasil menyelesaikan todo")
      this.props.fetchTodoGlobal()
    })
    .catch(() => {
      alert("Terjadi kesalahan di server")
    })
  }

  renderTodoList = () => {
    return this.props.todoGlobalState.todoList.map((val) => {
      return (
        <TodoItem 
          completeTodoHandler = {this.completeTodo}
          deleteTodoHandler = {this.deleteTodo}
          todoData = {val}/>
      )
    })
  }

  addTodo = () => {
    Axios.post("http://localhost:2000/todo", {
      activity: this.state.inputTodo,
      isFinished: false
    })
    .then(() => {
      alert("Berhasil menambahkan Todo")
      this.props.fetchTodoGlobal()
    })
    .catch((err) => {
      alert("Terjadi kesalahan di server")
    })
  }

 

  inputHandler = (event) => {
    this.setState({inputTodo: event.target.value})
  }

  componentDidMount() {
    this.props.fetchTodoGlobal()
  }


  render(){
  return (
    <div className="container mt-3">
      <button className="btn btn-info" onClick={this.fetchTodo}>Get my Todo List {this.props.todoGlobalState.todoCount}</button>
      {this.renderTodoList()}
      <div>
        <input onChange={this.inputHandler} type="text" className="mx-3"/>
        <button onClick={this.addTodo} className="btn btn-primary">Add Todo</button>
        <button onClick={this.props.incrementTodo} className="btn btn-warning">
          Increment Todo
        </button>
        <button onClick={this.props.decrementTodo} className="btn btn-info">
          Decrement Todo
        </button>
        <button onClick={() => this.props.changeTodo(7)} className="btn btn-dark">
          Change Todo
        </button>
      </div>
    </div>
  );
  }
}




const mapStateToProps = (state) => {
  return {
    testingProps: 0,
    todoGlobalState: state.todo
  }
}

const mapDispatchToProps = {
  incrementTodo: incrementTodoCount,
  decrementTodo: decrementTodoCount,
  changeTodo : changeTodoCount,
  fetchTodoGlobal
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoPage);
