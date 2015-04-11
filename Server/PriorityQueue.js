function PriorityQueue(criteria, heapType) {
    this.criteria = criteria;
    this.length = 0;
    this.queue = [];
    this.isMax = !!heapType;
    if ( heapType !== 0 && heapType !== 1 ){
        throw heapType + " not supported.";
    }
}
PriorityQueue.prototype.insert = function (value) {
    if (!value.hasOwnProperty(this.criteria)) {
        throw "Cannot insert " + value + " because it does not have a property by the name of " + this.criteria + ".";
    }
    this.queue.push(value);
    this.length++;
    this.bubbleUp(this.length - 1);
};
PriorityQueue.prototype.getHighestPriorityElement = function () {
    return this.queue[0];
};
PriorityQueue.prototype.shiftHighestPriorityElement = function () {
    if (this.length < 0) {
        throw("There are no more elements in your priority queue.");
    }
    var oldRoot = this.queue[0];
    var newRoot = this.queue.pop();
    this.length--;
    this.queue[0] = newRoot;
    this.swapUntilQueueIsCorrect(0);
    return oldRoot;
};
PriorityQueue.prototype.bubbleUp = function (index) {
    if (index === 0) {
        return;
    }
    var parent = this.getParentOf(index);
    if (this.evaluate(index, parent)) {
        this.swap(index, parent);
        this.bubbleUp(parent);
    } else {
        return;
    }
};
PriorityQueue.prototype.swapUntilQueueIsCorrect = function (value) {

	if (this.length <= 1) return;
	
    var left = this.getLeftOf(value),
        right = this.getRightOf(value);

    if (this.evaluate(left, value)) {
        this.swap(value, left);
        this.swapUntilQueueIsCorrect(left);
    } else if (this.evaluate(right, value)) {
        this.swap(value, right);
        this.swapUntilQueueIsCorrect(right);
    } else if (value === 0) {
        return;
    } else {
        this.swapUntilQueueIsCorrect(0);
    }
};
PriorityQueue.prototype.swap = function (self, target) {
    var placeHolder = this.queue[self];
    this.queue[self] = this.queue[target];
    this.queue[target] = placeHolder;
};
PriorityQueue.prototype.evaluate = function (self, target) {
    if (this.queue[target] === null || this.queue[self] === null) {
        return false;
    }
    if (this.isMax) {
        return (this.queue[self][this.criteria] > this.queue[target][this.criteria]);
    } else {
        return (this.queue[self][this.criteria] < this.queue[target][this.criteria]);
    }
};
PriorityQueue.prototype.getParentOf = function (index) {
    return Math.floor(index / 2) - 1;
};
PriorityQueue.prototype.getLeftOf = function (index) {
    return index * 2 + 1;
};
PriorityQueue.prototype.getRightOf = function (index) {
    return index * 2 + 2;
};
PriorityQueue.MAX_HEAP = 0;
PriorityQueue.MIN_HEAP = 1;

module.exports = PriorityQueue;