// Copy paste this code in the editor https://jscomplete.com/repl and hit CTRL+ENTER

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) =>{
	return (
  	<div className="col-5">
    	{
        _.range(props.randomNoOfStars).map((i) => 
          <i key={i} className ="fa fa-star"></i>
        )
      }
    </div>
  )
}

const Buttons = (props) =>{
	let button;
  switch(props.answerIsCorrect){
  	case true:
    	button = <button className="btn btn-success" onClick={props.acceptAnswer}>
      						<i className="fa fa-check"></i>
      				</button>;
      break;
    case false:
    	button = <button className="btn btn-danger">
      						<i className="fa fa-times"></i>
      				</button>;
      break;
    default:
    	button = <button className="btn" disabled=       {props.selectedNo.length === 0} onClick={props.checkAnswer}>=</button>;
      break;
    }
	return (
  	<div className="col-2 text-center">
    	{button}
      <br /><br />
      <button className="btn btn-warning btn-sm" onClick={props.redraws} disabled={props.redraw === 0}>
      	
      	<i className="fa fa-refresh">{'  '}{props.redraw}</i>
      </button>
    </div>
  )
}

const Answer = (props) =>{
	return (
  	<div className="col-5 text-center">
    	{props.selectedNo.map((n, i) => 
      	<span key={i} onClick={() => props.onUnselectNumbers(n)}>
        	{n}
        </span>
      )}
    </div>
  )
}

const Numbers = (props) =>{
	const numberClass =  (number) => {
  	if(props.usedNumbers.indexOf(number) >= 0){
      return 'used';
    }
    
    if(props.selectedNo.indexOf(number) >= 0){
      return 'selected';
    }
    
  }
 
  return (
  	<div className="card text-center">
      <div>
        {
        	Numbers.list.map((number, i) => 
        		<span key={i} className={numberClass(number)}
            			onClick={() => props.onClickNo(number)}>
                  	{number}
            </span>
        	)
        }
      </div>
    </div>
  )
}

Numbers.list = _.range(1, 10);

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
    	<br /> <br />
    	<h4>{props.doneStatus}</h4>
      <button className="btn btn-secondary btn-sm" onClick={props.resetGame}>Play Again</button>
    </div>
  )
}

class Game extends React.Component {
	static initialState = () => ({
  	selectedNo : [],
    randomNoOfStars: 1 + Math.floor(Math.random()*9),
    usedNumbers : [],
    answerIsCorrect: null,
    redraw: 5,
    doneStatus :null,
  })
	state = Game.initialState();
  
	resetGame = () => this.setState(Game.initialState());
  
  onClickNumbers = (clickedNo) => {
  	if(this.state.selectedNo.indexOf(clickedNo) >= 0){return;}
    if(this.state.usedNumbers.indexOf(clickedNo) >= 0){return;}
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNo: prevState.selectedNo.concat(clickedNo)
    }));
  }
  
  onUnselectNumbers = (clickedNo) => {
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNo: prevState.selectedNo.filter(number => number !== clickedNo)
    }));
  }
  
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNoOfStars ===
      	prevState.selectedNo.reduce((total, number) => total + number, 0)
    }));
  }
  
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNo),
      answerIsCorrect: null,
      selectedNo: [],
      randomNoOfStars: 1 + Math.floor(Math.random()*9),
    }), this.updateDoneStatus);
  }
  
  redraws = () => {
  	if(this.state.redraw === 0){return;}
  	this.setState(prevState => ({
    	randomNoOfStars: 1 + Math.floor(Math.random()*9),
      answerIsCorrect: null,
      selectedNo: [],
      redraw: prevState.redraw - 1,
    }), this.updateDoneStatus);
  }
  
  possibleSolutions = ({randomNoOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter((number) => 
    	usedNumbers.indexOf(number) === -1
    );
    
    return possibleCombinationSum(possibleNumbers, randomNoOfStars);
  }
  
  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9){
      	return { doneStatus: 'Done. Nice!' };
      }
      if(prevState.redraw === 0 && !this.possibleSolutions(prevState)){
      	return { doneStatus: 'Game Over!' };
      }
    });
  }

	render(){
  	const {selectedNo, randomNoOfStars, usedNumbers, answerIsCorrect, redraw, doneStatus} = this.state;
  	return (
    	<div className="container">
      	<h3> Play nine </h3>
	      <hr/>
        <div className="row">
        	<Stars randomNoOfStars={randomNoOfStars}/>
        	<Buttons  selectedNo={selectedNo}
          					checkAnswer={this.checkAnswer}
                    acceptAnswer={this.acceptAnswer}
                    redraws={this.redraws}
                    answerIsCorrect={answerIsCorrect}
                    redraw={redraw}/>
        	<Answer selectedNo={selectedNo}
          				onUnselectNumbers={this.onUnselectNumbers}/>
        </div>
        <br/>
        {
        	doneStatus ? <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> :
          						<Numbers selectedNo={selectedNo}
                             onClickNo={this.onClickNumbers}
                             usedNumbers={usedNumbers}/>
        }
      </div>
    )
  }
}

class App extends React.Component {
  render(){
		return (
    	<div>
      	<Game />
      </div>
    )
  }
}

ReactDOM.render(<App />, mountNode);