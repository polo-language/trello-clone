'use strict'

//////////////////////////////////////////////////////////////////////////
//// Board
function Board(title) {
  var nextId = 0

  this.lists = [new List(undefined, 'New list...')]
  this.title = title
  this.node = document.createElement('div')
  this.titleNode = document.createElement('div')
  this.listsNode = document.createElement('div')
  this.node.id = 'board'
  this.titleNode.id = 'board-title'
  this.listsNode.id = 'board-canvas'

  this.getNextId = function() {
    return nextId++
  }
}

Board.prototype.addList = function () {
}

Board.prototype.render = function () {
  this.titleNode.appendChild(document.createTextNode(this.title))
  for (var i = 0; i < this.lists.length; ++i) {
    this.lists[i].render()
    this.listsNode.appendChild(this.lists[i].node)
  }
  this.lists[this.lists.length-1].node.onclick = addList(this)
  this.node.appendChild(this.titleNode)
  this.node.appendChild(this.listsNode)
}

function addList(board) {
  return function () {
    // TODO: open lightbox for title input
    var title = 'New list: ' + (Math.round(Math.random()*1000)).toString()
     ,  list = new List(board, title)
    board.lists.splice(board.lists.length-1, 0, list)    
    list.render()
    board.listsNode.insertBefore(list.node, board.lists[board.lists.length-1].node)
  }
}

Board.prototype.removeList = function () { /* TODO */ }

Board.prototype.logAction = function (action) { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// List
function List(board, title) {
  this.board = board
  this.title = title
  this.cards = []
  this.node = document.createElement('div')
  this.titleNode = document.createElement('div')
  this.cardsNode = document.createElement('div')
}

List.prototype.render = function () {
  this.node.classList.add('list')
  this.titleNode.classList.add('list-title')
  this.cardsNode.classList.add('list-cards')
  this.titleNode.appendChild(document.createTextNode(this.title))
  for (var i = 0; i < this.cards.length; ++i) {
    this.cardsNode.appendChild(this.cards[i].render())
  }
  this.node.appendChild(this.titleNode)
  this.node.appendChild(this.cardsNode)
}

List.prototype.addCard = function () { /* TODO */ }

List.prototype.removeCard = function () { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// Card
function Card(list, title, newCard) {
  this.list = list
  this.id = list.board.getNextId()
  this.badges = {}
  this.desc = ''
  this.due = undefined
  if (newCard) {  // for per-list-singleton 'new card' card only
    this.title = 'New card...'
    this.actions = []
    this.click = list.addCard()
  } else {
    this.title = title
    this.actions = [new Action(list.board, 'createCard', title)]
    this.click = this.edit()
  }
}

Card.prototype.render = function () { /* TODO */ }

Card.prototype.edit = function () { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// Actions
function Action(board, type, label) {
  var action = new ActionFactory(type, label)
  board.logAction(action)
  return action
}

function ActionFactory(type, label) {
  this.date = new Date()
  this.type = type
  this.desc = Action.prototype.getActionDesc(type, label)
}

Action.prototype.getActionDesc = function (type, label) {
  var ACTION_STRINGS =
  { 'createList': 'Added {desc} to this board'
  , 'createCard': 'Added {desc} to this list'
  }
  return ACTION_STRINGS[type].replace('{desc}', label) +
         ' at ' + this.date.toLocaleTimeString();
}


//////////////////////////////////////////////////////////////////////////
//// 'main'
var bodyEl = document.getElementsByTagName('body')
bodyEl.onload = render()

function render() {
  var containerEl = document.getElementById('container')
  var title = 'New Board'   // TODO input title
  buildBoard(containerEl, title)
}

function buildBoard(containerEl, title) {
  var board = new Board(title)
  board.render()
  containerEl.appendChild(board.node)
}


//////////////////////////////////////////////////////////////////////////
//// Utilities

// function getNow() {
//   return (new Date()).toISOString()
// }
