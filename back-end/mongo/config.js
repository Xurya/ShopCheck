const crypto = require('crypto');

const schedule = require('node-schedule');

let secret = crypto.randomBytes(32).toString("hex");


class Configs {
    constructor(db) {
        this.collection = db.collection('Configs');
    }

    async init(){
        let configs = this.getConfigs();
        if(configs==null){
            secret = crypto.randomBytes(32).toString("hex");
            let val = await this.collection.insertOne(
                {
                    "username": "configs",
                    "secret":secret,
                    "refresh": new Date().getUTCDay()
                });
        }else{
            this.updateSecret();
        }
        //Check for refresh and auto refresh secrets every midnight
        schedule.scheduleJob('0 0 * * *', () => {
            let day = getConfigs()["refresh"];
            if(day!=new Date().getUTCDay()){
                this.resetSecret; //Currently always resetting, assuming a single server. 
            }
            this.updateSecret();
        });
    }

    async getConfigs(){
        let configs = await this.collection.find({username:"configs"}).toArray();
        return configs[0];
    }

    async resetSecret(){
        let secret = crypto.randomBytes(32).toString("hex");
        let val = await this.collection.updateOne({username:"configs"},
        { $set: {
                "secret":secret,
                "refresh": new Date().getUTCDay()
        }});
    }
    async updateSecret(){
        let configs = await this.collection.find({username:"configs"}).toArray();
        secret = configs[0].secret;
    }
    async getSecret(){
        return secret;
    }
}

module.exports = Configs