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
let nowDeliveryOption;
describe('Transfer API', async () => {
  context('Now delivery option', () => {
    before(async () => {
      response = await transferApi.get();
      expect(response.statusCode).to.eq(200);
      nowDeliveryOption = response.body.deliveryOptions.now;
    });
    context('Payment option', async () => {
      it(`should have bank payment option`, async () => {
        expect(nowDeliveryOption.paymentOptions).to.have.property('bank');
      })
      it(`should should have correct receiving amount for bank payment option`, async () => {
        const paymentOption = nowDeliveryOption.paymentOptions.bank
        const finalFee = paymentOption.quote.fees.finalFee;
        const sendingAmount = paymentOption.quote.sendingAmount
        const receivingAmount = paymentOption.quote.sendingAmount;
        expect(receivingAmount).to.eq(sendingAmount - finalFee)
      })
      it(`should have card payment option`, async () => {
        expect(nowDeliveryOption.paymentOptions).to.have.property('card');
      })
      it(`should should have correct receiving amount for card payment option`, async () => {
        const paymentOption = nowDeliveryOption.paymentOptions.card
        const finalFee = paymentOption.quote.fees.finalFee;
        const sendingAmount = paymentOption.quote.sendingAmount
        const receivingAmount = paymentOption.quote.sendingAmount;
        expect(receivingAmount).to.eq(sendingAmount - finalFee)
      })
    })

    // Doubles the test for the general max amount limit since this could change
    it("should have amount limit", async () => {
      const maxAmount = nowDeliveryOption.configuration.maxAmount;
      const response = await transferApi.setAmount(maxAmount + 1).get();
      expect(response.statusCode).to.eq(200)
      const { deliveryOptions: { now: { availability } } } = response.body
      expect(availability.isAvailable).to.be.false
      expect(availability.reason).to.eq('AMOUNT_LIMIT_EXCEEDED')
    })
  });
});
