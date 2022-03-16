
const expect = require("chai").expect;
const { TransferApiWrapper } = require('../../services/transferApi');

const transferApi = new TransferApiWrapper()
  .setCalculationBase('sendAmount')
  .setAmount('150.00')
  .setFromCountryCode('LT')
  .setToCountryCode('PL')
  .setfromCurrencyCode('EUR')
  .settoCurrencyCode('EUR')

let response;
let standardDeliveryOption;
describe('Transfer API', async () => {
  context('Standard delivery option', () => {
    before(async () => {
      response = await transferApi.get();
      standardDeliveryOption = response.body.deliveryOptions.standard;
    });
    context('Payment option', async () => {
      it(`should have bank payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        expect(standardDeliveryOption.paymentOptions).to.have.property('bank');
      })
      it(`should should have correct receiving amount for bank payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        const paymentOption = standardDeliveryOption.paymentOptions["bank"]
        const finalFee = paymentOption.quote.fees.finalFee;
        const sendingAmount = paymentOption.quote.sendingAmount
        const receivingAmount = paymentOption.quote.sendingAmount;
        expect(receivingAmount).to.eq(sendingAmount - finalFee)
      })
      it(`should have card payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        expect(standardDeliveryOption.paymentOptions).to.have.property('card');
      })
      it(`should should have correct receiving amount for card payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        const paymentOption = standardDeliveryOption.paymentOptions["card"]
        const finalFee = paymentOption.quote.fees.finalFee;
        const sendingAmount = paymentOption.quote.sendingAmount
        const receivingAmount = paymentOption.quote.sendingAmount;
        expect(receivingAmount).to.eq(sendingAmount - finalFee)
      })
    })

    // Doubles the test for the general max amount limit since this could change
    it("should have amount limit", async () => {
      const maxAmount = standardDeliveryOption.configuration.maxAmount
      const response = await transferApi.setAmount(maxAmount + 1).get();
      expect(response.body.error).to.eq("AMOUNT_IS_TOO_LARGE")
      expect(response.body.message).to.eq("invalidAmount")
    })
  });
});
