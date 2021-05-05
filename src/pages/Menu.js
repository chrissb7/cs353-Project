import React, {Component} from "react";
import "./Menu.css";
import arrow from "../img/arrow.png";
import meals from "../jsonData/FoodMenu.json";
import $ from "jquery";
import firebase from "firebase/app";
import userSelected from "../jsonData/localData.json";

class Menu extends Component {
    constructor(props) {
        super(props);
        // set two state variable to handle user current page and sidebar toggle
        this.state = {
            menuStatus: [false, false, false],
            mealSelected: null
        };
        $("body").click(function () {
            $("#daySelector").hide();
        });
    }

    menuClick(index) {
        let newMenuStatus = [false, false, false];
        newMenuStatus[index] = !this.state.menuStatus[index];
        this.setState({menuStatus: newMenuStatus});
        var cuisineName;
        if(index===0){
            cuisineName = "Europe";
        }else if(index===1){
            cuisineName = "North America";
        }else if(index===2){
            cuisineName = "Asia";
        }
        var cuisine = meals[cuisineName];
        var h = (cuisine.Breakfast.length + cuisine.Lunch.length + cuisine.Dinner.length) * 8.3 + 3 * 4;
        $(":root").css("--box-height", h + "vh");
    }

    renderMeals(cuisineName) {
        var cuisine = meals[cuisineName];
        return (<div>
            <div className="mealTime"><strong>Breakfast</strong></div>
            {cuisine.Breakfast.map((meal, index) => {
                return <div key={index} className="meal">
                    <p>{meal.name}</p>
                    <p><span className="calorie">{meal.calorie}</span> <span className="gram">{meal.gram}</span></p>
                    <button type="button" onClick={this.addButtonClick.bind(this)}>+</button>
                </div>
            })}
            <div className="mealTime"><strong>Lunch</strong></div>
            {cuisine.Lunch.map((meal, index) => {
                return <div key={index} className="meal">
                    <p>{meal.name}</p>
                    <p><span className="calorie">{meal.calorie}</span> <span className="gram">{meal.gram}</span></p>
                    <button type="button" onClick={this.addButtonClick.bind(this)}>+</button>
                </div>
            })}
            <div className="mealTime"><strong>Dinner</strong></div>
            {cuisine.Dinner.map((meal, index) => {
                return <div key={index} className="meal">
                    <p>{meal.name}</p>
                    <p><span className="calorie">{meal.calorie}</span> <span className="gram">{meal.gram}</span></p>
                    <button type="button" onClick={this.addButtonClick.bind(this)}>+</button>
                </div>
            })}
        </div>);
    }

    addButtonClick(event) {
        event.stopPropagation();
        var mealEntry = $(event.target).parent();
        this.setState({
            mealSelected: {
                name: mealEntry.find("p").eq(0).text(),
                calorie: mealEntry.find("p").eq(1).find("span").eq(0).text(),
                gram: mealEntry.find("p").eq(1).find("span").eq(1).text()
            }
        });
        $("#daySelector").css({
            "top": event.target.offsetTop - 1 - event.target.offsetHeight / 2 + "px",
            "left": event.target.offsetLeft + event.target.offsetWidth + "px"
        }).show();
    }

    mealSelector(event) {
        var uid = firebase.auth().currentUser.uid;
        var day = $(event.target).text();
        var meal = this.state.mealSelected;
        userSelected.push({uid: uid, day: day, meal: meal});
        console.log(meal);
        console.log(uid);
    }

    render() {
        return (
            <div>
                <div className="menus" onClick={this.menuClick.bind(this, 0)}>
                    <p className="cuisine">Europe</p>
                    <img src={arrow} className={this.state.menuStatus[0] ? "arrow-active" : "arrow"} alt=""/>
                </div>
                <div className={this.state.menuStatus[0] ? "boxes-active" : "boxes"}>
                    {this.renderMeals("Europe")}
                </div>
                <div className="menus" onClick={this.menuClick.bind(this, 1)}>
                    <p className="cuisine">North America</p>
                    <img src={arrow} className={this.state.menuStatus[1] ? "arrow-active" : "arrow"} alt=""/>
                </div>
                <div className={this.state.menuStatus[1] ? "boxes-active" : "boxes"}>
                    {this.renderMeals("North America")}
                </div>
                <div className="menus" onClick={this.menuClick.bind(this, 2)}>
                    <p className="cuisine">Asia</p>
                    <img src={arrow} className={this.state.menuStatus[2] ? "arrow-active" : "arrow"} alt=""/>
                </div>
                <div className={this.state.menuStatus[2] ? "boxes-active" : "boxes"}>
                    {this.renderMeals("Asia")}
                </div>
                <div id="daySelector">
                    <div onClick={this.mealSelector.bind(this)}>Monday</div>
                    <div onClick={this.mealSelector.bind(this)}>Tuesday</div>
                    <div onClick={this.mealSelector.bind(this)}>Wednesday</div>
                    <div onClick={this.mealSelector.bind(this)}>Thursday</div>
                    <div onClick={this.mealSelector.bind(this)}>Friday</div>
                    <div onClick={this.mealSelector.bind(this)}>Saturday</div>
                    <div onClick={this.mealSelector.bind(this)}>Sunday</div>
                </div>

                <div id="counter">
                    <p>Open Calories Counter</p>
                </div>

            </div>
        );
    }
}

export default Menu;
