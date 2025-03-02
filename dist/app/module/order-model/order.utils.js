"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUtils = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const shurjopay_1 = __importDefault(require("shurjopay"));
const config_1 = __importDefault(require("../../config"));
const shurjopay = new shurjopay_1.default();
// Setting up shurjopay credentials from the environment variables
shurjopay.config(config_1.default.sp.sp_endpoint, config_1.default.sp.sp_username, config_1.default.sp.sp_password, config_1.default.sp.sp_prefix, config_1.default.sp.sp_return_url);
//console.log(shurjopay);
const makePayment = (paymentPayload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        shurjopay.makePayment(paymentPayload, (response) => resolve(response), (error) => reject(error));
        //console.log(makePayment);
    });
    //   const paymentResult = await shurjopay.makePayment(
    //     paymentPayload,
    //     (response) => {
    //       sendResponse(res, {
    //         statusCode: httpStatus.CREATED,
    //         success: true,
    //         message: 'Order created successfully',
    //         data: response,
    //       });
    //     },
    //     (error) => console.log(eroor),
    //   );
    //   return paymentResult;
});
const verifyPaymentAsync = (order_id) => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(order_id, (response) => resolve(response), (error) => reject(error));
    });
};
exports.orderUtils = {
    makePayment,
    verifyPaymentAsync,
};
