import { ErrorWriterOptions } from 'strong-error-handler';
import { LogError, Reject } from '../types';
export declare class RejectProvider {
    static value(logError: LogError, errorWriterOptions?: ErrorWriterOptions): Reject;
}
