const request = require('supertest');
const { BASE_URL } = require('../config')

class TransferApiWrapper {
  #baseUrl;
  #endpoint = '/transfers/quote?'
  #calculationBase;
  #amount;
  #fromCountryCode
  #toCountryCode
  #fromCurrencyCode
  #toCurrencyCode
  constructor(baseUrl = BASE_URL) {
    this.#baseUrl = baseUrl
  }
  setCalculationBase(calculationBase) {
    if (calculationBase.length == 0) {
      throw new Error("calculationBase is empty")
    }
    this.#calculationBase = `calculationBase=${calculationBase}`
    return this;
  }
  setAmount(amount) {
    if (amount.length == 0) {
      throw new Error("amount is empty")
    }
    this.#amount = `amount=${amount}`
    return this;
  }
  setFromCountryCode(fromCountryCode) {
    if (fromCountryCode.length == 0) {
      throw new Error("fromCountryCode is empty")
    }
    this.#fromCountryCode = `fromCountryCode=${fromCountryCode}`
    return this;
  }
  setToCountryCode(toCountryCode) {
    if (toCountryCode.length == 0) {
      throw new Error("toCountryCode is empty")
    }
    this.#toCountryCode = `toCountryCode=${toCountryCode}`
    return this;
  }
  setfromCurrencyCode(fromCurrencyCode) {
    if (fromCurrencyCode.length == 0) {
      throw new Error("fromCurrencyCode is empty")
    }
    this.#fromCurrencyCode = `fromCurrencyCode=${fromCurrencyCode}`
    return this;
  }
  settoCurrencyCode(toCurrencyCode) {
    if (toCurrencyCode.length == 0) {
      throw new Error("toCurrencyCode is empty")
    }
    this.#toCurrencyCode = `toCurrencyCode=${toCurrencyCode}`
    return this;
  }
  getUrl() {
    const queryString = [
      this.#calculationBase, this.#amount,
      this.#fromCountryCode, this.#toCountryCode, this.#fromCurrencyCode,
      this.#toCurrencyCode].join("&")

    return `${this.#endpoint}${queryString}`
  }
  async get() {
    return request(this.#baseUrl).get(this.#getUrl());
  }
}

module.exports = { TransferApiWrapper }
