
const expect = require("chai").expect;
const { TransferApiWrapper } = require('../../services/transferApi');

const transferApi = new TransferApiWrapper()
  .setCalculationBase('sendAmount')
  .setAmount('150.00')
  .setFromCountryCode('TR')
  .setToCountryCode('PL')
  .setFromCurrencyCode('TRY')
  .setToCurrencyCode('EUR')

let response;
let todayDeliveryOption;
describe('Transfer API', async () => {
  context('Today delivery option', () => {
    before(async () => {
      response = await transferApi.get()
      todayDeliveryOption = response.body.deliveryOptions.today;
    });
    context('Payment option', async () => {
      it(`should have bank payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        expect(todayDeliveryOption.paymentOptions).to.have.property('bank');
      })
      it(`should should have correct receiving amount for bank payment option`, async () => {
        expect(response.statusCode).to.equal(200)
        const paymentOption = todayDeliveryOption.paymentOptions["bank"]
        const finalFee = paymentOption.quote.fees.finalFee;
        const sendingAmount = paymentOption.quote.sendingAmount
        const receivingAmount = paymentOption.quote.sendingAmount;
        expect(receivingAmount).to.eq(sendingAmount - finalFee)
      })
    })

    // Doubles the test for the general max amount limit since this could change
    it("should have amount limit", async () => {
      const maxAmount = todayDeliveryOption.configuration.maxAmount
      const response = await transferApi.setAmount(maxAmount + 1).get();
      expect(response.statusCode).to.eq(422)
      expect(response.body.error).to.eq("AMOUNT_IS_TOO_LARGE")
      expect(response.body.message).to.eq("invalidAmount")
    })
  });
});
