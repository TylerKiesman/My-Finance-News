const dotenv = require('dotenv');
dotenv.config();

class Stock {
    constructor(ticker){
        this.symbol = ticker;
    }
}