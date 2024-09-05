import { expect, describe, it, jest } from '@jest/globals';
import { PresentableError } from '../src/util';

describe('PresentableError', () => {
    it('should print an error message', () => {
        const error = new PresentableError('This is a test error');
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        PresentableError.presentError(error);
        expect(console.error).toHaveBeenCalledWith('This is a test error');
        spy.mockRestore();
    });
    it('should print a warning message', () => {
        const error = new PresentableError('This is a test warning', 'warn');
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        PresentableError.presentError(error);
        expect(console.warn).toHaveBeenCalledWith('This is a test warning');
        spy.mockRestore();
    });
    it('should present a valid error', () => {
        const error = new Error('This is a test error');
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        PresentableError.presentError(error);
        expect(console.error).toHaveBeenCalledWith('Error: This is a test error');
        spy.mockRestore();
    });
    it('should handle unknown error types', () => {
        const error = { message: 'This is a test error' };
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        PresentableError.presentError(error);
        expect(console.error).toHaveBeenCalledWith('some unknown error happened');
        spy.mockRestore();
    });
    it('should present to a custom console', ()=>{
        const error = new PresentableError('This is a test error');
        const customConsole = {
            error: jest.fn(),
            warn: jest.fn(),
        } as unknown as Console;
        PresentableError.presentError(error, customConsole);
        expect(customConsole.error).toHaveBeenCalledWith('This is a test error');
    })
});