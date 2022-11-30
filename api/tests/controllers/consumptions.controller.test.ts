import { ConsumptionController } from "../../controllers/consumptions.controller";
import { IConsumption } from "../../data/models/consumptions.model";
import { ConsumptionService } from "../../services/consumptions.service";

jest.mock('../../services/consumptions.service', () => {
    const mConsumptionService = { 
        bulkCreateConsumptions: jest.fn(),
        createConsumption: jest.fn(),
        getAllConsumptions: jest.fn()
    };
    return {
        ConsumptionService: jest.fn(() => mConsumptionService)
    };
});

describe("ConsumptionController", () => {    
    const service = new ConsumptionService();
    const controller = new ConsumptionController();
    const mockDateObject = new Date("2021-02-26T20:42:16.652Z");

    const mRequest = (body?: any, params?: any) => {
        const req: any = {};
        req.body = jest.fn().mockReturnValue(body || req);
        req.params = jest.fn().mockReturnValue(params || req);
        return req;
    };
    const mResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("ConsumptionController.createConsumption", () => {
        const mCreateBody: IConsumption = {
            consumptionId: 1,
            timeInterval: mockDateObject,
            heatDemand: 1897,
            electricityDemand: 1699,
            electricityPrice: 18,
            gasPrice: 15,
            siteId: 1,
            orgId: 1
        };
        const mSuccessReponse: any = {
            message: 'Created',
            status: 201,
            data: mCreateBody
        };
        const mFailResponse: any = {
            message: "server error: failed to create a consumption.",
            status: 500
        };

        it('should create a consumption when request body is provided', async () => {
            // Given
            const req = mRequest(mCreateBody);
            const res = mResponse();
            const createSpy = jest
                .spyOn(service, 'createConsumption')
                .mockResolvedValue(mCreateBody);

            // When
            await controller.createConsumption(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mSuccessReponse);

            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy.mock.results[0].value).toEqual(Promise.resolve(mCreateBody));
        });

        it('should not create a consumption when request body is not provided', async () => {
            // Given
            const req = mRequest();
            const res = mResponse();
            const createSpy = jest
                .spyOn(service, 'createConsumption')
                .mockRejectedValue({});

            // When
            await controller.createConsumption(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(mFailResponse);

            expect(createSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("ConsumptionController.getAllConsumptions", () => {
        const mConsumption: IConsumption[] = [{
            consumptionId: 1,
            timeInterval: mockDateObject,
            heatDemand: 1897,
            electricityDemand: 1699,
            electricityPrice: 18,
            gasPrice: 15,
            siteId: 1,
            orgId: 1
        },
        {
            consumptionId: 2,
            timeInterval: mockDateObject,
            heatDemand: 2897,
            electricityDemand: 2699,
            electricityPrice: 28,
            gasPrice: 25,
            siteId: 2,
            orgId: 2
        },
        {
            consumptionId: 3,
            timeInterval: mockDateObject,
            heatDemand: 3897,
            electricityDemand: 3699,
            electricityPrice: 38,
            gasPrice: 35,
            siteId: 3,
            orgId: 3
        }];
        const mSuccessResponse: any = {
            message: 'Success',
            status: 200,
            data: mConsumption
        };
        const mFailResponse: any = {
            message: "server error: failed to fetch consumptions.",
            status: 500
        };

        it('should fetch all consumptions when there is data in the response', async () => {
            // Given
            const req = mRequest();
            const res = mResponse();
            const getSpy = jest
                .spyOn(service, 'getAllConsumptions')
                .mockResolvedValueOnce(mConsumption);

            // When
            await controller.getAllConsumptions(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mSuccessResponse);

            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy).toHaveBeenCalledWith();
        });

        it('should not fetch consumptions when there is no data in the response', async () => {
            // Given
            const req = mRequest();
            const res = mResponse();
            const getSpy = jest
                .spyOn(service, 'getAllConsumptions')
                .mockRejectedValue({});

            // When
            await controller.getAllConsumptions(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(mFailResponse);

            expect(getSpy).toHaveBeenCalledTimes(1);
        });
    });
});

