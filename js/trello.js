'use strict'
var nextId = 0

//////////////////////////////////////////////////////////////////////////
//// Board
function Board(title) {
  this.lists = [] // TODO: initialize with empty card?
  this.title = title
  /* TODO */
}

Board.prototype.render = function () { /* TODO */ }
Board.prototype.addList = function () { /* TODO */ }



//////////////////////////////////////////////////////////////////////////
//// List
function List(title) {
  this.title = title
  this.cards = [new Card(/* TODO: initialize with empty card */)]
  /* TODO */
}

List.prototype.render = function () { /* TODO */ }
List.prototype.addCard = function () { /* TODO */ }
List.prototype.delete = function () { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// Card
function Card(title) {
  this.id = getId()
  this.badges = {}
  this.desc = ''
  this.due = null
  this.title = title
  this.actions = [new Action('createList', title)]
}

Card.prototype.render = function () { /* TODO */ }
Card.prototype.delete = function () { /* TODO */ }

//////////////////////////////////////////////////////////////////////////
//// Actions
function Action(type, label) {
  this.date = new Date()  //getNow()
  this.type = type
  this.desc = this.getDesc(label)
}

Action.prototype.getDesc = function(label) {
  var ACTION_STRINGS = {
    'createList': 'Added {desc} to this board',
    'createCard': 'Added {desc} to this list'
  }
  return ACTION_STRINGS[this.type].replace('{desc}', label) +
         ' at ' this.date.toLocaleTimeString();
}

//////////////////////////////////////////////////////////////////////////
//// Utilities
function getId() {
  return nextId++;
}

// function getNow() {
//   return (new Date()).toISOString()
// }

//// Static
