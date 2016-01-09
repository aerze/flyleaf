var carPrototype = {
    wheels: 4,
    distance: 0,
    doors: 4,
    drive: function drive(miles) {
        this.distance += miles;
    },
    getDistance: function getDistance() {
        return this.distance;
    }
}


var redcar = Object.create(carPrototype);
var greencar = Object.create(carPrototype);
console.log(redcar, greencar);

redcar.drive(10);
greencar.drive(5);
redcar.__proto__.wheels = 6;
console.log(redcar, greencar);


function Car() {
    car = Object.create(carPrototype);
    car.wheels = 4;
    car.distance = 0;
    car.seats = 3;
    car.drive = function drive(miles) {
        car.distance += miles;
    }
    car.getDistance = function getDistance() {
        return car.distance;
    }
    return car;
}

var bluecar = new Car();
console.log(bluecar);