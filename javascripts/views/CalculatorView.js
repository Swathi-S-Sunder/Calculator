/**
 * Created with IntelliJ IDEA.
 * User: swathis
 * Date: 9/7/13
 * Time: 11:41 AM
 * To change this template use File | Settings | File Templates.
 */

Calculator.Views.CalculatorView = Ember.ContainerView.extend({

    childViews: ['Caption','Display','ButtonCollection'],
    contentBinding: "Calculator.Models.calculatorModel",
    Caption: Ember.View.extend({
        tagName: 'h6',
        template: Ember.Handlebars.compile('Calculator')
    }),

    Display: Ember.ContainerView.extend({
        childViews: ['CompleteOperandsView','CurrentOperandView'],
        classNames: ['display-container'],
        contentBinding: 'parentView.content',

        CompleteOperandsView: Ember.TextArea.extend({
            attributeBindings:['rows','readonly'],
            rows: 1,
            readonly: 'readonly',
            valueBinding: 'parentView.content.displayValue'
        }),

        CurrentOperandView: Ember.TextField.extend({
            valueBinding: 'parentView.content.result'
        })
    }),

    ButtonCollection: Ember.ContainerView.extend({
        childViews: ['SpecialButtons','OperatorButtons','DigitButtons'],
        contentBinding: 'parentView.content',
        SpecialButtons: Ember.CollectionView.extend({
            contentBinding: 'parentView.content.specialButtons',
            classNames: 'spl-btn-container',
            itemViewClass: Calculator.Views.ButtonView.extend({
                title: 'content.title',
                type: 'content.type'
            })
        }),
        DigitButtons: Ember.CollectionView.extend({
            contentBinding: 'parentView.content.digitButtons',
            classNames: 'dgt-btn-container',
            itemViewClass: Calculator.Views.ButtonView.extend({
                title: 'content.title',
                type: 'content.type'
            })
        }),
        OperatorButtons: Ember.CollectionView.extend({
            contentBinding: 'parentView.content.operatorButtons',
            classNames: 'opr-btn-container',
            itemViewClass: Calculator.Views.ButtonView.extend({
                title: 'content.title',
                type: 'content.type'
            })
        }),
        classNames: ['buttons-container']
        // this will be a collectionView - that will in turn consist of buttonView
    }),

    classNameBindings: ['themeClass','containerClass'],
    themeClass: function() {
        return this.content.theme;
    }.property(),
    containerClass: 'calculator-container'
});