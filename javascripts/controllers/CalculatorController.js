/**
 * Created with IntelliJ IDEA.
 * User: swathis
 * Date: 9/7/13
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */

Calculator.Controllers.CalculatorController = Ember.ArrayController.extend({
        // method that is called when objects are instantiated
     init: function() {

         // button data
         // use ALT+27 for ← , ALT+0177 for ± and ALT+251 for √

         var digitButtons = ['7','8','9','4','5','6','1','2','3','0','.'];
         var specialButtons = ['MC','MR', 'MS', 'M+', 'M-', '←', 'CE', 'C', '±', '√'];
         var binaryOperatorButtons = ['/', '%', '*', '1/x', '-', '=', '+'];
         var specialButtonsArray = [], digitButtonsArray = [], operatorButtonsArray = [];

         // populate the calculator with buttons
         for(var j = 0; j < specialButtons.length; j++){
             specialButtonsArray.push(Calculator.Models.ButtonModel.create({ title: specialButtons[j], type: 'spl'}));
         }
         for(var i = 0; i < digitButtons.length; i++){
             digitButtonsArray.push(Calculator.Models.ButtonModel.create({ title: digitButtons[i], type: 'dgt' }));
         }
         for(var j = 0; j < binaryOperatorButtons.length; j++){
             operatorButtonsArray.push(Calculator.Models.ButtonModel.create({ title: binaryOperatorButtons[j], type: 'opr'}));
         }

         Calculator.Models.calculatorModel = Calculator.Models.CalculatorModel.create({'specialButtons': specialButtonsArray, 'digitButtons': digitButtonsArray, 'operatorButtons': operatorButtonsArray});
    },

    // invokes appropriate commands based on the character pressed
    buttonPressed: function(character) {

        var character = character + '';

        if(!this.isOperator(character))
            this.digitButtonPressed(character);
        else {
            switch(character) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '√':
                    this.operatorButtonPressed(character);
                    break;
                case '=':
                    if(Calculator.Models.calculatorModel.get('operator') !== '')
                        this.calculateButtonPressed(false);
                    break;
                case 'C':
                case 'CE':
                    this.clearButtonPressed();
                    break;
                case '←':
                    this.backSpaceButtonPressed();
                    break;
            }
        }
    },

    //clears the rightmost character
    backSpaceButtonPressed: function() {

        var tempValue = Calculator.Models.calculatorModel.get('result');
        var model = Calculator.Models.calculatorModel;
        var lastCharacter = tempValue.substr(tempValue.length-1);

        if(this.isOperator(lastCharacter))
            model.setProperties({'operator': '', 'isOperatorPressed': false});
        else {
            var operand1 = model.get('operand1');
            var operand2 = model.get('operand2');
            if(operand2 === '0')
                model.set('operand1', (operand1.length > 1) ? operand1.substr(0,operand1.length-1) : '0');
            else
                model.set('operand2', (operand2.length > 1) ? operand2.substr(0,operand2.length-1) : '0');
        }
        Calculator.Models.calculatorModel.set('result',(tempValue.length > 1) ? tempValue.substr(0,tempValue.length-1) : '0');
    },

    // sets the model attributes to default
    clearButtonPressed: function() {

        Calculator.Models.calculatorModel.setProperties({
            operand1: '0',
            operand2: '0',
            operator: '',
            isOperatorPressed: false,
            result: '0',
            displayValue:''
        });
    },

    // concatenates the operand with the recently entered digit
    concatCommand: function(operand1,digit) {

        if(operand1 == '0' && digit == '0')
            return operand1;
        if(operand1 == '0' && digit !== '.' && digit != '0')
            return digit;
        if((operand1 != '0' && (!this.isOperator(digit))) || (operand1 == '0' && digit === '.'))
            return operand1 + digit;
    },

    // performs the calculation and stores the resultant in the model
    calculateButtonPressed: function(returnFlag) {

        var result, precision = 0, model = Calculator.Models.calculatorModel;

        var operand1 = parseFloat(model.operand1);
        var operand2 = parseFloat(model.operand2);

        switch(model.operator) {
            case '+':
                result = operand1 + operand2;
                break;
            case '-':
                result = operand1 - operand2;
                break;
            case '*':
                result = operand1 * operand2;
                break;
            case '/':
                result = operand1 / operand2;
                break;
        }

        if( (operand1+'').indexOf('.') !== -1 && parseFloat(operand1) !== parseInt(operand1,10))
            precision = (operand1+'').split('.')[1].length;
        if( (operand2+'').indexOf('.') !== -1 && parseFloat(operand2) !== parseInt(operand2,10))
            precision = Math.max(precision,(operand2+'').split('.')[1].length);

        result = result.toFixed(precision);
        if(isNaN(result))
            result = 'Result is undefined';

        if(!returnFlag)
            model.setProperties({'displayValue': '', 'result': result, 'operand1': result, 'operand2': '0', 'operator': '', 'isOperatorPressed': false});
        else
            return result;
    },

    // handles the actions when digit button is pressed
    digitButtonPressed: function(digit) {

        var tempValue;
        //first operand is pressed i.e., operator button has not yet been pressed
        if( Calculator.Models.calculatorModel.get('isOperatorPressed') === false ) {
                tempValue = this.concatCommand(Calculator.Models.calculatorModel.get('operand1'),digit);
                Calculator.Models.calculatorModel.setProperties({'operand1': tempValue, 'result': tempValue });
        }
        //second operand is pressed
        else {
                tempValue = this.concatCommand(Calculator.Models.calculatorModel.get('operand2'),digit);
                Calculator.Models.calculatorModel.setProperties({'operand2': tempValue, 'displayValue': Calculator.Models.calculatorModel.get('displayValue'), 'result': tempValue});
        }
    },

    // handles the actions when operator button is pressed
    operatorButtonPressed: function(operator) {

        var tempValue, displayValue, lastCharacter;

        if(operator === '√') {
            displayValue = Calculator.Models.calculatorModel.get('displayValue');
            if(Calculator.Models.calculatorModel.get('operand2') != '0' ) {
                tempValue = Math.sqrt(Calculator.Models.calculatorModel.get('operand2'));
                displayValue += 'sqrt('+ Calculator.Models.calculatorModel.get('operand2') +')';
                Calculator.Models.calculatorModel.setProperties({'displayValue': displayValue, 'operand2': tempValue, 'result': tempValue });
            }
            else {
                tempValue = Math.sqrt(Calculator.Models.calculatorModel.get('operand1'));
                displayValue = 'sqrt('+ ( displayValue == '' ? Calculator.Models.calculatorModel.get('operand1') : displayValue )+')';
                Calculator.Models.calculatorModel.setProperties({'displayValue': displayValue, 'operand1': tempValue, 'result': tempValue });
            }
        }
        else {
            if( Calculator.Models.calculatorModel.get('isOperatorPressed') === false ) {
                Calculator.Models.calculatorModel.setProperties({'operator': operator, 'isOperatorPressed': true, 'displayValue': Calculator.Models.calculatorModel.get('result')+operator, 'result': Calculator.Models.calculatorModel.get('operand1')});
            }
            else {
                displayValue = (Calculator.Models.calculatorModel.get('displayValue')+( ( Calculator.Models.calculatorModel.get('displayValue').indexOf('sqrt') !== -1 || Calculator.Models.calculatorModel.get('operand2') == 0 ) ? '' : Calculator.Models.calculatorModel.get('result')));
                lastCharacter = displayValue.substr(displayValue.length-1);

                if( this.isOperator(lastCharacter) && this.isOperator(operator) ) {
                    displayValue = displayValue.substr(0,displayValue.length-1)+operator;
                    tempValue = Calculator.Models.calculatorModel.get('result');
                }
                else {
                    displayValue = displayValue+operator;
                    tempValue = this.calculateButtonPressed(true);
                }

                Calculator.Models.calculatorModel.setProperties({'operator': operator, 'displayValue': displayValue , 'result': tempValue, 'operand1': tempValue, 'operand2': '0' });
            }
        }
    },

    // detects whether the parameter is an operator or not
    isOperator: function(character) {

        if(/^[0-9\.]$/.test(character))
            return false;
        else
            return true;
    }
});

Calculator.Controllers.calculatorController = Calculator.Controllers.CalculatorController.create({});