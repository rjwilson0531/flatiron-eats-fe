import React from 'react';
import {Route, Redirect} from 'react-router-dom' // switch
import RestaurantContainer from './containers/RestaurantContainer';
import FoodContainer from './containers/FoodContainer';
import Navbar from './components/Navbar'
import Login from './components/Login'
import ProfileContainer from './containers/ProfileContainer' 


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      currentUser: null,
      cart: [],
      searchTerm: ''
    };
  }

  componentDidMount() {
    fetch("https://flatiron-eats-backend.herokuapp.com/restaurants")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ restaurants: json });
      });
  }

  addItemToCart = (event,food) => {
    event.preventDefault();
    this.setState({cart: [...this.state.cart, food]})
    setTimeout( () =>
      console.log(`The cart now has ${this.state.cart.length} items.`)
    ,50)
  };

  checkoutCart = (event) => {
    event.preventDefault();
    console.log("Checking out cart")
    let cart = this.state.cart;
    let user = localStorage.getItem("user_id");
    fetch("https://flatiron-eats-backend.herokuapp.com/orders",
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"cart": cart,"user_id": user})
    })
    this.setState({cart: []})
    alert('Your order has been placed!')
  }

  updateCurrentUser = (user) => {
    console.log(user)
    this.setState({
      currentUser: user,
      searchTerm: ''
    })
    localStorage.setItem("user_id",user.id)
    console.log(localStorage.getItem("user_id"))
  }

  updateSearchTerm  = (event) =>{
    console.log(event.target.value)
    this.setState({
      searchTerm: event.target.value
    })
  }


  render() {
    return (
      <div className="App">
        <Navbar updateSearchTerm={this.updateSearchTerm} searchTerm={this.state.searchTerm} cart={this.state.cart} checkout={this.checkoutCart}/>

        <Route exact path="/restaurant/:id" render={(props) =>{
            let restaurantId = props.match.params.id
            if (this.state.restaurants.length > 0) {
              let foundrestaurant = this.state.restaurants.find(r => r.id == restaurantId)
            return <FoodContainer restaurant={foundrestaurant} addItem={this.addItemToCart} />
            }else {
              return null
            }
        }}/>

        <Route exact path="/profile" render={()  => <ProfileContainer />}  />

        <Route exact path="/login"> {this.state.currentUser ? <Redirect to='/' /> : <Login addUser={this.updateCurrentUser}/>} </Route> 

        <Route exact path="/" render={() => <RestaurantContainer restaurants={this.state.restaurants} searchTerm={this.state.searchTerm} />}/>  


      </div>
    );
  }
}

export default App;
