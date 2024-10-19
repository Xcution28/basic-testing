// Uncomment the code below and write your tests
import {getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initial_balance = 100;
    const account = getBankAccount(initial_balance);
    expect(account.getBalance()).toBe(initial_balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initial_balance = 100;
    const account = getBankAccount(initial_balance);
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initial_balance = 100;
    const account1 = getBankAccount(initial_balance);
    const account2 = getBankAccount(0);
    expect(() => account1.transfer(200, account2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initial_balance = 100;
    const account = getBankAccount(initial_balance);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initial_balance = 100;
    const deposit_amount = 50;
    const account = getBankAccount(initial_balance);
    account.deposit(deposit_amount);
    expect(account.getBalance()).toBe(initial_balance + deposit_amount);
  });

  test('should withdraw money', () => {
    const initial_balance = 100;
    const withdraw_amount = 50;
    const account = getBankAccount(initial_balance);
    account.withdraw(withdraw_amount);
    expect(account.getBalance()).toBe(initial_balance - withdraw_amount);
  });

  test('should transfer money', () => {
    const initial_balance1 = 100;
    const initial_balance2 = 0;
    const transfer_amount = 50;
    const account1 = getBankAccount(initial_balance1);
    const account2 = getBankAccount(initial_balance2);
    account1.transfer(transfer_amount, account2);
    expect(account1.getBalance()).toBe(initial_balance1 - transfer_amount);
    expect(account2.getBalance()).toBe(initial_balance2 + transfer_amount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(typeof balance).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(0);
    await account.synchronizeBalance();
    const balance = account.getBalance();
    expect(typeof balance).toBe('number');
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
