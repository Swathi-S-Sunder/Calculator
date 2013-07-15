/**
 * Created with IntelliJ IDEA.
 * User: swathis
 * Date: 9/7/13
 * Time: 10:17 AM
 * To change this template use File | Settings | File Templates.
 */

Calculator.Models.CalculatorModel = Ember.Object.extend({
    type: '',                           // Type may take values such as Simple, Scientific, Programmer etc.
    theme: 'classic',                          // Theme refers to styles/skins
    operand1: '0',
    operand2: '0',
    operator: '',
    result: '0',                        // Result holds the resultant of the operation
    displayValue: '',
    isOperatorPressed: false,
    buttons: []                         // array to hold the buttons
});


