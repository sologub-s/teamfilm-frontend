import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({name: 'shorten'})
export class ShortenPipe implements PipeTransform {
    transform(value: string, length: number, ender: string = '...'): string {
        return value.substring(0, isNaN(length) ? 20 : length) + ender;
    }
}