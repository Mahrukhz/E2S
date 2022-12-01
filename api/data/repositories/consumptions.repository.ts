import { start } from "repl";
import { connect } from "../config/db.config";
import { Consumptions, IConsumption } from "../models/consumptions.model";
import { Op } from "sequelize"; 

export class ConsumptionRepository {
    private db: any = {};
    private consumptionRepository: any;

    constructor() {
        this.db = connect();
        this.db.Sequelize.sync({}) 
            .then(() => {
                console.log("Sync db.");
            })
            .catch((err: { message: string; }) => {
                console.log("Failed to sync db: " + err.message);
            });   
        this.consumptionRepository = this.db.Sequelize.getRepository(Consumptions);
    }
    
    async bulkCreateConsumptions(consumptions: IConsumption[]): Promise<IConsumption[]> {
        let data = [];
        try {
            data = await this.consumptionRepository.bulkCreate(consumptions);
        } catch(err) {
            throw new Error("Failed to bulk create consumptions." || err);
        }
        return data;
    }

    async createConsumption(consumption: IConsumption): Promise<IConsumption> {
        let data = {};
        try {
            data = await this.consumptionRepository.create(consumption);
        } catch(err) {
            throw new Error("Failed to create consumption." || err);
        }
        return data;
    }

    async getAllConsumptions(): Promise<IConsumption[]> {
        let data = [];
        try {
            data = await this.consumptionRepository.findAll();
        } catch (err) {
            throw new Error("Failed to fetch all consumptions." || err);
        }
        return data;
    }

    async findAllConsumptionsBySiteAndTime(startTime: string, endTime: string, siteId: number): Promise<IConsumption[]> {
        let data = [];

        // Convert start/end to Dates from String
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);

        try {
            data = await this.consumptionRepository.findAll({
                where: {
                    siteId,
                    timeInterval: {
                        [Op.between]: [startTimeDate, endTimeDate]
                    }
                  }
              });
        } catch (err) {
            throw new Error("Failed to fetch all consumptions." || err);
        }
        return data;
    }
}