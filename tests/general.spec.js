const expect = require("chai").expect;
const { TransferApiWrapper } = require('../services/transferApi');
const transferApi = new TransferApiWrapper();
const { performance } = require('perf_hooks');

describe('Transfer API', async () => {
  beforeEach(() => {
    transferApi
      .setCalculationBase('sendAmount')
      .setAmount('150.00')
      .setFromCountryCode('LT')
      .setToCountryCode('PL')
      .setfromCurrencyCode('EUR')
      .settoCurrencyCode('EUR')
  })
  it("should have standard delivery option", async () => {
    const response = await transferApi.get();

    expect(response.statusCode).to.equal(200)
    expect(response.body.deliveryOptions).to.have.property('standard');
  })
  it("should have now delivery option", async () => {
    const response = await transferApi.get();

    expect(response.statusCode).to.equal(200)
    expect(response.body.deliveryOptions).to.have.property('now')
  })
  it("should have today delivery option", async () => {
    const response = await transferApi
      .setFromCountryCode('TR')
      .setfromCurrencyCode('TRY')
      .get();
    expect(response.statusCode).to.equal(200)
    expect(response.body.deliveryOptions).to.have.property('today')
  })
  context('maximum amount limit', () => {
    it("should succeed when at limit", async () => {
      const response = await transferApi.setAmount('1000000').get();
      expect(response.statusCode).to.equal(200)
    })
    it("should not succeed when above limit", async () => {
      const response = await transferApi.setAmount('1000001').get();

      expect(response.statusCode).to.eq(422)
      expect(response.body.error).to.eq("AMOUNT_IS_TOO_LARGE")
      expect(response.body.message).to.eq("invalidAmount")
    })
  })
  context('minimum amount limit', () => {
    it("should succeed when at limit", async () => {
      const response = await transferApi.setAmount('1').get();
      expect(response.statusCode).to.equal(200)
    })
    it("should not succeed when below limit", async () => {
      const response = await transferApi.setAmount('0.9').get();
      expect(response.statusCode).to.eq(422)
      expect(response.body.error).to.eq("AMOUNT_IS_TOO_SMALL")
      expect(response.body.message).to.eq("tooSmallAmount")
    })
  })
  // k6 or other performance tool could be used to automate all of the scenarios
  // more non-functional requirements would be needed so I decided to opt for 'basic'
  // performance measurement node api
  it("should response within 200 ms", async () => {
    const startTime = performance.now();
    const response = await transferApi.get();
    expect(performance.now() - startTime, 'Response time is above 200ms').to.be.below(200);
    expect(response.statusCode).to.equal(200)
  });
})
