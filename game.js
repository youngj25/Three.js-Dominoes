var socket,Dom = io('/domino', {forceNew:true});
var player=-1,Turn=-1,sum=100;
var Game_Status,camera;
var objects = [], board = [], dominoes= [];
var refresh_time = 0,wait=0, backgroundDisplay = 0,DominoesStyle=0;
var numberOfDominoes=28; //The number of dominoes in the game
var placeHolderHeight = -5.0;
var leftValue = -1,rightValue =-1, CenterPiece;
var Dominoe1, Dominoe2, Dominoe3, Dominoe4, Dominoe5, Dominoe6, Dominoe7, handSize=7;
var DominoesAmount = 28;
//Board Design
var Board, placeHolder;
var Wood,Tile,J1,J2;
//Start Game
var startDominoes1,startDominoes2,startDominoes3,startDominoes4,startDominoes5,startDominoes6,startDominoes7, r=0, Start,Title1,Title2;
var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster(), pos = new THREE.Vector3();
//Sub-Game
var removed = 0, points = 168;
//Game info Backscene
var infoBackscene;
//How To Play Slides
var Slides;
//Passes Object - when the anyone passes an object appears
var Pass1, Pass2, Pass3, Pass4, Pass_Breaks =0;
//Text
var StartGameMesh, AboutMesh, HowToPlayMesh, CreditsMesh, text;
var P1Score, P2Score, P3Score, P4Score, PlayerNotification, DominoStyles, BackgroundStyle, BackgroundGroup, PlayAgain;
var clickable = [];

function setup() {
		// create a scene, that will hold all our elements such as objects, cameras and lights.
		var scene = new THREE.Scene();				
		
		// create a camera, which defines where we're looking at.
		//camera = new THREE.PerspectiveCamera(45, 800/ 500, 0.1, 1000);
		camera = new THREE.PerspectiveCamera(45, 800/ 500, 0.1, 1000);
		camera.position.set(0,0,50);
		scene.add(camera);
		//console.log(camera);
		
		// create a render and set the size
		var renderer = new THREE.WebGLRenderer({ antialias: true} );
		renderer.setClearColor(new THREE.Color(0x000000, 0.0));
		//set the size
		//renderer.setSize(600, 750);
		//renderer.setSize(650, 675);
		//renderer.setSize(window.innerWidth*0.75, window.innerHeight*0.7);
		
		var Width,Height;
		
		if(window.innerWidth > 900) Width = 750;
		else Width = window.innerWidth*0.75;
			
		if(window.innerHeight > 900) Height = 775;
		else Height = window.innerHeight*0.7;
		
		renderer.setSize(Width, Height);
		
		//console.log("W:"+window.innerWidth+"  H:"+window.innerHeight);
		//console.log(renderer);
		//camera.aspect = renderer.domElement.width/renderer.domElement.height;
		camera.aspect = window.innerWidth/window.innerHeight;
		
		//renderer.shadowMapEnabled = true	
		
		//Later change this back to false
		var endGame = true; //The Game is over and you'll have to restart
		
		var controls = new THREE.TrackballControls( camera );
		//controls.rotateSpeed = 1.0;
		//controls.zoomSpeed = 1.2;
		//controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3; 
				
		//Sockets
		//socket = io.connect('http://localhost:9000');
		socket = io.connect('ec2-34-205-146-82.compute-1.amazonaws.com:9000');
		
		//Updates the scoreboard of all the player
		Dom.on('scores', function(scores) {
				if(Game_Status == "Active" || Game_Status == "Game Over"){
					
					//Score for Player 1
					if(scores.P1 != -1)
						P1score.parameters.text= "P1: "+scores.P1;					
					else
						P1score.parameters.text= "";
					P1score.update();
					
					//Score for Player 2
					if(scores.P2 != -1)
						P2score.parameters.text= "P2: "+scores.P2;					
					else
						P2score.parameters.text= "";
					P2score.update();
					
					//Score for Player 3
					if(scores.P3 != -1)
						P3score.parameters.text= "P3: "+scores.P3;					
					else
						P3score.parameters.text= "";
					P3score.update();
					
					//Score for Player 4
					if(scores.P4 != -1)
						P4score.parameters.text= "P4: "+scores.P4;					
					else
						P4score.parameters.text= "";
					P4score.update();
				}
			});
		
		//Check to see if we have Double 6 and plays it
		Dom.on('Winner', function(data) {
				if(Game_Status == "Active"){
					var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
					
					if(data.winner == 0){
						var T = loader.load( 'Pictures/WP1.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 1){
						var T = loader.load( 'Pictures/WP2.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 2){
						var T = loader.load( 'Pictures/WP3.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 3){
						var T = loader.load( 'Pictures/WP4.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					
					scene.add(Title1);
					Title1.position.set(0,0,37); 
					Title1.scale.set(17,3,1);
					Game_Status = "Game Over";
					
					//document.getElementById("PlayAgain").innerHTML = "Play Again?";
					
					//PlayAgain Button					
					var T = loader.load( 'Pictures/PlayAgain.png' );
					T.minFilter = THREE.LinearFilter;
					var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
					PlayAgain = new THREE.Sprite(T1);
					scene.add(PlayAgain);
					PlayAgain.scale.set(9.5,4,1);
					PlayAgain.position.set(0, 3.95,37);
					PlayAgain.callback = function() {
							if(Game_Status == "Game Over"){
								//We have to remove everything from the scene again
								try{
									//Remove Titles
									scene.remove(Title1);
									scene.remove(Title2);
									//Incase Passes are still on the scene, remove them as well
									scene.remove(Pass1);
									scene.remove(Pass2);
									scene.remove(Pass3);
									scene.remove(Pass4);
									//Removes dominoes, should resolve void dominoes error
									scene.remove( Dominoe1 );
									scene.remove( Dominoe2 );
									scene.remove( Dominoe3 );
									scene.remove( Dominoe4 );
									scene.remove( Dominoe5 );
									scene.remove( Dominoe6 );
									scene.remove( Dominoe7 );
									//Remove Play Again Sign
									scene.remove(PlayAgain);
									
									//Resets the board
									leftValue = -1,rightValue =-1, CenterPiece=0;
									
									Game_Status = "Ready";
									//objects = [], board = [];
									while(objects.length != 0){
										scene.remove(objects[0]);
										objects.splice(0,1);
									}
									while(board.length != 0){
										scene.remove(board[0]);
										board.splice(0,1);
									}
									//Ready to Start the next Game
									Dom.emit('Start Count to the Next Game');
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
								}
							}
					};
					clickable.push(PlayAgain);
					
					if(data.winner == (player-1))
						PlayerNotification.parameters.text= "You won Player "+player+"!!!!!!!!!";
					else 
						PlayerNotification.parameters.text= "Sorry Player "+player+", you did not win...";
				}
			});
		
		//The Game is Blocked!!!
		Dom.on('Blocked', function(data) {
				if(Game_Status == "Active"){
					var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
					
					if(data.winner == 0){
						var T = loader.load( 'Pictures/WP1.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 1){
						var T = loader.load( 'Pictures/WP2.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 2){
						var T = loader.load( 'Pictures/WP3.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					else if(data.winner == 3){
						var T = loader.load( 'Pictures/WP4.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title1 = new THREE.Sprite(T1);
					}
					
					if(Game_Status != "Game Over"){
						scene.add(Title1);
						Title1.position.set(0,-1.5,37); 
						Title1.scale.set(16,2.75,1);
						
						T = loader.load( 'Pictures/Blocked.png' );
						T.minFilter = THREE.LinearFilter;
						T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Title2 = new THREE.Sprite(T1);
						
						scene.add(Title2);
						Title2.position.set(0,3.45,37); 
						Title2.scale.set(16,2.75,1);
						
						Game_Status = "Game Over";
					}
					
					var T = loader.load( 'Pictures/PlayAgain.png' );
					T.minFilter = THREE.LinearFilter;
					var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
					PlayAgain = new THREE.Sprite(T1);
					scene.add(PlayAgain);
					PlayAgain.scale.set(9.5,4,1);
					PlayAgain.position.set(0, 1.95,37);
					PlayAgain.callback = function() {
							if(Game_Status == "Game Over"){
								//We have to remove everything from the scene again
								try{
									//Remove Titles
									scene.remove(Title1);
									scene.remove(Title2);
									//Incase Passes are still on the scene, remove them as well
									scene.remove(Pass1);
									scene.remove(Pass2);
									scene.remove(Pass3);
									scene.remove(Pass4);
									//Removes dominoes, should resolve void dominoes error
									scene.remove( Dominoe1 );
									scene.remove( Dominoe2 );
									scene.remove( Dominoe3 );
									scene.remove( Dominoe4 );
									scene.remove( Dominoe5 );
									scene.remove( Dominoe6 );
									scene.remove( Dominoe7 );
									//Remove Play Again Sign
									scene.remove(PlayAgain);
									
									//Resets the board
									leftValue = -1,rightValue =-1, CenterPiece=0;
									
									Game_Status = "Ready";
									//objects = [], board = [];
									while(objects.length != 0){
										scene.remove(objects[0]);
										objects.splice(0,1);
									}
									while(board.length != 0){
										scene.remove(board[0]);
										board.splice(0,1);
									}
									//Ready to Start the next Game
									Dom.emit('Start Count to the Next Game');
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
								}
							}
					};
					clickable.push(PlayAgain);
					
					if(data.winner == (player-1))
						PlayerNotification.parameters.text= "You won Player "+player+"!!!!!!!!!";
					else 
						PlayerNotification.parameters.text= "Sorry Player "+player+", you did not win...";
				}
			});
		
		//Add_Domino_to_Board
		Dom.on('Add_Domino_to_Board', function(data) {
				if(Game_Status == "Active"){
				  //console.log("Add ["+data.topNumber+"|"+data.bottomNumber+"] ("+data.dominoNumber+") to board");
				  Turn=data.Player;
				  console.log(Turn);
				  console.log(data.Player);
				  Pass_Breaks=0;
				  addToBoardfromServer(data.dominoNumber,data.preferred_side,data.PlayerDominoes);
				}
			});
		
		//Add_Domino_to_Board
		Dom.on('count', function(data) {
				if(Game_Status == "Active"){
					console.log("The Count is " + data.count);
				}
			  });
		
		//Add_Domino_to_Board
		Dom.on('Countdown', function(data) {
			if(Game_Status == "Ready"){
				//console.log("The Count is " + data.count);
				//document.getElementById("CenterLargeText").innerHTML = "Time left for new Players to Join: " + data.count + " seconds";
				document.getElementById("CenterLargeText").innerHTML = data.count + " seconds";
				//document.getElementById("CenterLargeText").style.backgroundColor = "#363636";
				  
				//https://www.w3schools.com/jsref/prop_style_color.asp
				if(data.count > 26) document.getElementById("CenterLargeText").style.color = "#74ff09"; //Light Green
				else if(data.count > 18) document.getElementById("CenterLargeText").style.color = "#eff206"; //Yellow
				else if(data.count > 10) document.getElementById("CenterLargeText").style.color = "#fe9106"; //Orange 
				else if(data.count > 0) document.getElementById("CenterLargeText").style.color = "#890101"; //Dark Red
				else{
					document.getElementById("CenterLargeText").innerHTML = "";
					//document.getElementById("CenterLargeText").style.backgroundColor = "transparent";
				}
				//https://www.w3schools.com/js/js_htmldom_css.asp
				//https://stackoverflow.com/questions/18038157/how-to-change-color-dynamically
				//Source: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
				
				/** Just me messing with the HTML Properties
				if(data.count > 26) document.getElementById("CenterLargeText").style.top = "332px";
				else if(data.count > 18) document.getElementById("CenterLargeText").style.top = "352px";
				else if(data.count > 10) document.getElementById("CenterLargeText").style.top = "372px";
				else if(data.count > 0) document.getElementById("CenterLargeText").style.top = "392px";
				**/
			}
		});
		
		//A Player Has PAssed
		Dom.on('Player Passed', function(data) {
				if(Game_Status == "Active"){
					Turn=data.Player;
					var temp = data.Player-1;
					if(temp < 0)
						temp=data.Number-1;
				  
					var time=1.5;
					
					var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
					
					if(temp == 0){
						var T = loader.load( 'Pictures/P1P.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Pass1 = new THREE.Sprite(T1);
						//Just in case there is already a Pass object in the scene
						try{
							scene.remove(Pass1);
							scene.add(Pass1);
							}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						Pass1.position.set(0,-1.75-Pass_Breaks,37); 
						Pass1.scale.set(10,1.5,1);
					}
					else if(temp == 1){
						var T = loader.load( 'Pictures/P2P.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Pass2 = new THREE.Sprite(T1);
						//Just in case there is already a Pass object in the scene
						try{
							scene.remove(Pass2);
							scene.add(Pass2);
							}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						Pass2.position.set(0,-1.75-Pass_Breaks,37); 
						Pass2.scale.set(10,1.5,1);
					}
					else if(temp == 2){
						var T = loader.load( 'Pictures/P3P.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Pass3 = new THREE.Sprite(T1);
						//Just in case there is already a Pass object in the scene
						try{
							scene.remove(Pass3);
							scene.add(Pass3);
							}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						Pass3.position.set(0,-1.75-Pass_Breaks,37); 
						Pass3.scale.set(10,1.5,1);
					}
					else if(temp == 3){
						var T = loader.load( 'Pictures/P4P.png' );
						T.minFilter = THREE.LinearFilter;
						var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
						Pass4 = new THREE.Sprite(T1);
						//Just in case there is already a Pass object in the scene
						try{
							scene.remove(Pass4);
							scene.add(Pass4);
							}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						Pass4.position.set(0,-1.75-Pass_Breaks,37); 
						Pass4.scale.set(10,1.5,1);
					}
					Pass_Breaks += 0.75;
				}
			});
		  
		//Can You Play A domino?
		Dom.on('CanYouPlay',function() {
				if(Game_Status == "Active"){
				  var data;
				  if(Dominoe1.material.fog == false && 
					((leftValue == dominoes[Dominoe1.material.name].TopNumber)||
					(leftValue ==  dominoes[Dominoe1.material.name].BottomNumber)||
					(rightValue == dominoes[Dominoe1.material.name].TopNumber)||
					(rightValue == dominoes[Dominoe1.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:1,player:player});
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe2.material.fog == false &&
					((leftValue == dominoes[Dominoe2.material.name].TopNumber)||
					(leftValue ==  dominoes[Dominoe2.material.name].BottomNumber)||
					(rightValue == dominoes[Dominoe2.material.name].TopNumber)||
					(rightValue == dominoes[Dominoe2.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:2,player:player});
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe3.material.fog == false &&
					((leftValue == dominoes[Dominoe3.material.name].TopNumber)||
						 (leftValue ==  dominoes[Dominoe3.material.name].BottomNumber)||
						 (rightValue == dominoes[Dominoe3.material.name].TopNumber)||
						 (rightValue == dominoes[Dominoe3.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:3,player:player});
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe4.material.fog == false &&
					  ((leftValue == dominoes[Dominoe4.material.name].TopNumber)||
					  (leftValue ==  dominoes[Dominoe4.material.name].BottomNumber)||
					  (rightValue == dominoes[Dominoe4.material.name].TopNumber)||
					  (rightValue == dominoes[Dominoe4.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:4,player:player});
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe5.material.fog == false && 
						((leftValue == dominoes[Dominoe5.material.name].TopNumber)||
						 (leftValue ==  dominoes[Dominoe5.material.name].BottomNumber)||
						 (rightValue == dominoes[Dominoe5.material.name].TopNumber)||
						 (rightValue == dominoes[Dominoe5.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:5,player:player});
						 console.log("5!!!!!");
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe6.material.fog == false &&
						((leftValue == dominoes[Dominoe6.material.name].TopNumber)||
						 (leftValue ==  dominoes[Dominoe6.material.name].BottomNumber)||
						 (rightValue == dominoes[Dominoe6.material.name].TopNumber)||
						 (rightValue == dominoes[Dominoe6.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:6,player:player});
						 console.log("6!!!!!");
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else if(Dominoe7.material.fog == false &&
					   ((leftValue == dominoes[Dominoe7.material.name].TopNumber)||
						 (leftValue ==  dominoes[Dominoe7.material.name].BottomNumber)||
						 (rightValue == dominoes[Dominoe7.material.name].TopNumber)||
						 (rightValue == dominoes[Dominoe7.material.name].BottomNumber))){
						 Dom.emit('Yes I Can Play', data ={no:7,player:player});
						 console.log("7!!!!!");
						 PlayerNotification.parameters.text= "It's your turn Player "+player+"!!!!";
						 PlayerNotification.update();
				  }
				  else{
					  Dom.emit('No I Can Not Play', data = {player:player});
					  console.log("pass me...");
				  }
				  console.log("hmmm L:"+leftValue+"  R:"+rightValue);
				}
			});
		 
		//The Dominoes you receive from the Server will be loaded into your hand
		Dom.on('Hand',function(hand) {
			
				if(Game_Status == "Ready"){
				  console.log("Domino 1: " + hand.one + " -> [" + dominoes[hand.one].TopNumber+"|"+dominoes[hand.one].BottomNumber+"]");
				  console.log("Domino 2: " + hand.two + " -> [" + dominoes[hand.two].TopNumber+"|"+dominoes[hand.two].BottomNumber+"]");
				  console.log("Domino 3: " + hand.three + " -> [" + dominoes[hand.three].TopNumber+"|"+dominoes[hand.three].BottomNumber+"]");
				  console.log("Domino 4: " + hand.four + " -> [" + dominoes[hand.four].TopNumber+"|"+dominoes[hand.four].BottomNumber+"]");
				  console.log("Domino 5: " + hand.five + " -> [" + dominoes[hand.five].TopNumber+"|"+dominoes[hand.five].BottomNumber+"]");
				  console.log("Domino 6: " + hand.six + " -> [" + dominoes[hand.six].TopNumber+"|"+dominoes[hand.six].BottomNumber+"]");
				  console.log("Domino 7: " + hand.seven + " -> [" + dominoes[hand.seven].TopNumber+"|"+dominoes[hand.seven].BottomNumber+"]");
					
					sum = dominoes[hand.one].TopNumber + dominoes[hand.one].BottomNumber + dominoes[hand.two].TopNumber + dominoes[hand.two].BottomNumber +
						  dominoes[hand.three].TopNumber + dominoes[hand.three].BottomNumber + dominoes[hand.four].TopNumber + dominoes[hand.four].BottomNumber +
						  dominoes[hand.five].TopNumber + dominoes[hand.five].BottomNumber + dominoes[hand.six].TopNumber + dominoes[hand.six].BottomNumber +
						  dominoes[hand.seven].TopNumber + dominoes[hand.seven].BottomNumber;
					
					var space = 2.55;
					Game_Status = "Active";
					player= hand.player;
					//document.getElementById("PlayerID").innerHTML = "You are Player "+hand.player;
					Turn= hand.turn;
					console.log("Player "+player);
					
					Dominoe1 =  new THREE.Sprite();
					scene.add( Dominoe1 );
					objects.push(Dominoe1);
					Dominoe1.material=dominoes[hand.one].Sprite;
					Dominoe1.material.name=hand.one;
					Dominoe1.material.rotation=Math.PI/2;
					Dominoe1.material.fog = false;
					Dominoe1.scale.set(1.75,1.75,1);
					Dominoe1.position.set( -7.75,placeHolderHeight,35 );

					Dominoe2 =  new THREE.Sprite();
					scene.add( Dominoe2 );
					objects.push(Dominoe2);
					Dominoe2.material=dominoes[hand.two].Sprite;
					Dominoe2.material.name=hand.two;
					Dominoe2.material.rotation=Math.PI/2;
					Dominoe2.material.fog = false;
					Dominoe2.scale.set(1.75,1.75,1);
					Dominoe2.position.set( -7.75 +space*1,placeHolderHeight,35 );
					
					Dominoe3 =  new THREE.Sprite();
					scene.add( Dominoe3 );
					objects.push(Dominoe3);
					Dominoe3.material=dominoes[hand.three].Sprite;
					Dominoe3.material.name=hand.three;
					Dominoe3.material.rotation=Math.PI/2;
					Dominoe3.material.fog = false;
					Dominoe3.scale.set(1.75,1.75,1);
					Dominoe3.position.set( -7.75 +space*2,placeHolderHeight,35 );
					
					Dominoe4 =  new THREE.Sprite();
					scene.add( Dominoe4 );
					objects.push(Dominoe4);
					Dominoe4.material=dominoes[hand.four].Sprite;
					Dominoe4.material.name=hand.four;
					Dominoe4.material.rotation=Math.PI/2;
					Dominoe4.material.fog = false;
					Dominoe4.scale.set(1.75,1.75,1);
					Dominoe4.position.set( -7.75 +space*3,placeHolderHeight,35 );
					
					Dominoe5 =  new THREE.Sprite();
					scene.add( Dominoe5 );
					objects.push(Dominoe5);
					Dominoe5.material=dominoes[hand.five].Sprite;
					Dominoe5.material.name=hand.five;
					Dominoe5.material.rotation=Math.PI/2;
					Dominoe5.material.fog = false;
					Dominoe5.scale.set(1.75,1.75,1);
					Dominoe5.position.set( -7.75 +space*4,placeHolderHeight,35 );
					
					Dominoe6 =  new THREE.Sprite();
					scene.add( Dominoe6 );
					objects.push(Dominoe6);
					Dominoe6.material=dominoes[hand.six].Sprite;
					Dominoe6.material.name=hand.six;
					Dominoe6.material.rotation=Math.PI/2;
					Dominoe6.material.fog = false;
					Dominoe6.scale.set(1.75,1.75,1);
					Dominoe6.position.set( -7.75 +space*5,placeHolderHeight,35 );
					
					Dominoe7 =  new THREE.Sprite();
					scene.add( Dominoe7 );
					objects.push(Dominoe7);
					Dominoe7.material=dominoes[hand.seven].Sprite;
					Dominoe7.material.name=hand.seven;
					Dominoe7.material.rotation=Math.PI/2;
					Dominoe7.material.fog = false;
					Dominoe7.scale.set(1.75,1.75,1);
					Dominoe7.position.set( -7.75 +space*6,placeHolderHeight,35 );
					
					//Hand Size Reset to 7
					handSize = 7;
					Dom.emit('Yes I Can Play', data ={no:1,player:player});
					
					//Plays Double Six automatically
					if((dominoes[hand.one].TopNumber == 6) && (dominoes[hand.one].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe1.material.fog= true;
						scene.remove(Dominoe1);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.two].TopNumber == 6) && (dominoes[hand.two].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe2.material.fog= true;
						scene.remove(Dominoe2);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.three].TopNumber == 6) && (dominoes[hand.three].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe3.material.fog= true;
						scene.remove(Dominoe3);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.four].TopNumber == 6) && (dominoes[hand.four].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe4.material.fog= true;
						scene.remove(Dominoe4);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.five].TopNumber == 6) && (dominoes[hand.five].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe5.material.fog= true;
						scene.remove(Dominoe5);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.six].TopNumber == 6) && (dominoes[hand.six].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe6.material.fog= true;
						scene.remove(Dominoe6);
						handSize--;
						sum -= 12;
					}
					else if((dominoes[hand.seven].TopNumber == 6) && (dominoes[hand.seven].BottomNumber ==6)){
						playDomino(27,"Left");
						Dominoe7.material.fog= true;
						scene.remove(Dominoe7);
						handSize--;
						sum -= 12;
					}
					
					//document.getElementById("Player1").innerHTML = "Player 1: "+data.P1;	
					//document.getElementById("Player2").innerHTML = "Player 2: "+hand.P2;	
					//document.getElementById("Player3").innerHTML = "Player 3: "+hand.P3;	
					//document.getElementById("Player4").innerHTML = "Player 4: "+hand.P4;
				}
			});
		
		//EVENT LISTENERS!!!!
		
		//Keyboard Functions
		//var onKeyDown = function(event) {
		function onKeyDown(event) {
			//Space Bar Changes Background
			if (event.keyCode == 13) { // Enter 
					console.log("enter was hit");
			}
			else if (event.keyCode == 48 && wait < step && Game_Status == "Ready") { // Zero 
					reshuffleDominoes();
					console.log("zero was hit");
					wait = step + 3;		
			}
			else if (event.keyCode == 19 && wait < step){ // Pause 
					Print();
					console.log("pause was hit");
					console.log("leftValue:"+leftValue);
					console.log("rightValue:"+rightValue);
					wait = step + 3;		
			}
		}; 
		document.addEventListener('keydown', onKeyDown, false);
		
		//Mouse Click
		function onDocumentMouseDown (event){
			//console.log("Click");
			if(Game_Status == "StartScreen"){
				load_HomeScene();
			}
			else{
				try{
					event.preventDefault();	
					// update the mouse variable
					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1.5;
					console.log("M.x: "+mouse.x+"  M.y:"+mouse.y+"  Game Status: "+Game_Status);
					
					projector = new THREE.Projector();
					var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
					projector.unprojectVector( vector, camera );
					var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
					
					var intersects = ray.intersectObjects( clickable );
					
					// if there is one (or more) intersections
					if ( intersects.length > 0 ){
						intersects[0].object.callback();
					}
				}
				catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
				}
			}
			//Source:view-source:https://stemkoski.github.io/Three.js/Mouse-Click.html
		}
		
			/**
			function onDocumentMouseDown (event){
				//console.log("yes");
				//console.log(event);
				//console.log("Client--  X: "+event.clientX+" Y: "+event.clientY);
				//console.log("Page--  X: "+event.pageX+" Y: "+event.pageY);
				//console.log("Screen--  X: "+event.screenX+" Y: "+event.screenY);
				//console.log("Renderer-- W: "+renderer.domElement.width+"  H: "+renderer.domElement.height);
				//console.log(renderer);
				
				if(Game_Status == "StartScreen"){
					load_HomeScene();
				}
				else if (Game_Status == "HomeScene"){
					raycaster = new THREE.Raycaster();
					mouse = new THREE.Vector2();
					event.preventDefault();
					mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
					//console.log("M.x: "+mouse.x+"  ClientX: "+event.clientX+"  Width.x:"+renderer.domElement.clientWidth);
					//console.log(" M.y:"+mouse.y+"  ClientY: "+event.clientY+" Height.y:"+renderer.domElement.clientHeight);
					raycaster.setFromCamera( mouse, camera );

					let intersects = raycaster.intersectObjects( clickable );
					
					//console.log("Inter");
					//console.log(intersects);
					//console.log("Rays");
					//console.log(raycaster);

					var planeGeometry = new THREE.PlaneBufferGeometry (0.5, 0.4,0);
					var planeMaterial = new THREE.MeshLambertMaterial({color: 0x029572}); //RGB		
					//var planeMaterial =  new THREE.MeshBasicMaterial( { map: Texture, color: 0xffffff } );
					var a = new THREE.Mesh(planeGeometry, planeMaterial);
					a.position.set(mouse.x,mouse.y,36); //xyz
					scene.add(a);	
					
					
					
					if ( intersects.length > 0 ) {
							intersects[0].object.callback();
						}
					//https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
				}
				else if(Game_Status == "Ready"||Game_Status == "Game Over"){
					raycaster = new THREE.Raycaster();
					mouse = new THREE.Vector2();
					event.preventDefault();
					mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1.3;
					mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1.3;
					//console.log("M.x: "+mouse.x+"  ClientX: "+event.clientX+"  Width.x:"+renderer.domElement.clientWidth);
					//console.log(" M.y:"+mouse.y+"  ClientY: "+event.clientY+" Height.y:"+renderer.domElement.clientHeight);
					raycaster.setFromCamera( mouse, camera );

					let intersects = raycaster.intersectObjects( clickable ); 

					if ( intersects.length > 0 ) {
							intersects[0].object.callback();
						}
					//https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
				}
					//event.preventDefault();
				//https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
			}
			**/
		renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
		//document.addEventListener('mousedown', onDocumentMouseDown, false)
		//window.addEventListener('mousedown', onDocumentMouseDown, false)
		//https://forums.khronos.org/showthread.php/8407-add-event-listener-in-webgl-designed-object		
		//renderer.domElement.addEventListener('click', console.log(":D"), false)
		//renderer.getElementById("startDominoes1").addEventListener("click", console.log(":D"));
		
		//Window Resize
		function onWindowResize(){
			//camera.aspect = window.innerWidth/window.innerHeight;
			
			//renderer.setSize(window.innerWidth*0.55, window.innerHeight*0.7);
			//console.log("W:"+window.innerWidth+"  H:"+window.innerHeight);
			/**
			if(((window.innerWidth/100) * (window.innerHeight/100))>=64){
				renderer.setSize(650, 675);
				document.getElementById("StartGame").style.fontSize  = "45px";
			}
				
			
			//Small Width and Large Height (Regardless it will shape it depending on the width from here on)
			else if(window.innerWidth<800 && window.innerHeight>=800){
				renderer.setSize(window.innerWidth*0.6, window.innerWidth*0.8);
				document.getElementById("StartGame").style.fontSize  = "25px";
			}
				
			
			//Small Width and Small Height
			else if(window.innerWidth<300 && window.innerHeight>=300){
				renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.7);
				document.getElementById("StartGame").style.fontSize= '15px';
			}
				
			**/
			var Width,Height;
			if(window.innerWidth > 900) Width = 750;
			else Width = window.innerWidth*0.75;
				
			if(window.innerHeight > 900) Height = 775;
			else Height = window.innerHeight*0.7;
			
			renderer.setSize(Width, Height);
			//else renderer.setSize(window.innerWidth*0.75, window.innerHeight*0.7);
			//console.log("W:"+window.innerWidth+"  H:"+window.innerHeight);
			camera.aspect = renderer.domElement.width/renderer.domElement.height;
			//camera.updateProjectionMatrix();
			//console.log(renderer.domElement.height);
			//console.log(renderer.domElement.width);
		}
		window.addEventListener('resize', onWindowResize, false);
		//https://stackoverflow.com/questions/20290402/three-js-resizing-canvas?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
		
		//HTML ELEMENTS
		var HowToPlay = document.getElementById("HowToPlay");
		HowToPlay.onclick = function(event) {
			load_HowToPlay();
			console.log("HowToPlay was Hit!!!!")
			};
			
		var About = document.getElementById("About");
		About.onclick = function(event) {
			load_About();
			console.log("About was Hit!!!!")
			};
		
		//source developers.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick
		
        //add spotlight for the shadows
		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(0, 80, 150);
		spotLight.castShadow = false;
		spotLight.intensity =2;
		scene.add(spotLight);		
		
		//Touch Screen events!!!
		renderer.domElement.addEventListener('touchstart', function(e){
			if(Game_Status == "StartScreen")
				load_HomeScene();
				
		}, false)
		//http://www.javascriptkit.com/javatutors/touchevents.shtml
		//https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
		
        //add the output of the renderer to the html element
		document.getElementById("WebGL-output").appendChild(renderer.domElement);
		
		//controls = new THREE.OrbitControls(camera, renderer.domElement);
			
        //orbit = new THREE.OrbitControls(camera, webGLRenderer.domElement);
		
        //call the render function
		renderer.render(scene, camera);
		//renderer.setClearColor(new THREE.Color(0x05d041, 1.0));
			
		//call the render function
		var step = 0;
			
		loadSprites();
		renderScene();
		drag_objects();
		//shuffle();
		load_StartScene();
			
		function renderScene(){
			try{
				//Render steps
					step += 0.1;
					
					//Refreshes the board every now and then
					if(step > refresh_time){
						reDraw_Board();
						//console.log("redrew");
						refresh_time=step+10;
					}
					
					//render using requestAnimationFrame
					requestAnimationFrame(renderScene);
					renderer.render(scene, camera);			
					
					//Move all the players
					scene.traverse(function (e) {
						if (e == Dominoe1 ||e == Dominoe2 || e == Dominoe3||
							e == Dominoe4 ||e == Dominoe5 ||e == Dominoe6 ||
							e == Dominoe7){							
							if (e.position.y < (placeHolderHeight + 1.5)) {
								e.material.rotation=Math.PI/2;
								e.scale.set(1.75,1.75,1);
								e.material.color.setHex(0xffffff);
								dominoes[e.material.name].Status = "taken";
							}
							else if(e.position.x < (LeftWall+3)){
								e.position.y = placeHolderHeight;
								e.position.x = e.position.x+4;
							}
							else if(e.position.x >(RightWall-3)){
								e.position.y = placeHolderHeight;
								e.position.x = e.position.x-4;
							}	
						}
						else if(e == Pass1 || e == Pass2 || e == Pass3 || e == Pass4){
							if(e.position.y <= 0){
								e.position.y += 0.015;
							}
							else scene.remove(e);
						}
						else if(e == startDominoes1 || e == startDominoes2 || e == startDominoes3||
								e == startDominoes4 || e == startDominoes5 || e == startDominoes6 || e == startDominoes7){
							
							//Wall Limits
							var BottomWall = -9;
							var LeftWall = -5.5;
							var RightWall = 5;
							
							e.position.y -= 0.05;
							
							//IF the dominoes goes to low reset it
							if(e.position.y < (BottomWall-2)){
								//e.position.y = Math.floor(Math.random()*4)+10;
								e.position.y = 10;
							}
							
						}
						else if(e == Title1 && Game_Status == "HomeScene" && e.position.y < 4){
							e.position.y+=0.15;
						}
					});
			}catch(e){

				//functionToHandleError(e);		
				//He HE HE don't say a word if errors happen
				
			}
		}
		
		function drag_objects(){
			var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );

				dragControls.addEventListener( 'dragstart', function(event) {
																			controls.enabled = false;
																			//console.log("lol start of drag: ");
																			});
																			
				dragControls.addEventListener( 'dragend', function(event)   {
																				controls.enabled = true;
																				//console.log("lol end of drag: ");
																				
																				if((leftValue == dominoes[event.object.material.name].TopNumber ||
																				   leftValue ==  dominoes[event.object.material.name].BottomNumber||
																				   rightValue == dominoes[event.object.material.name].TopNumber ||
																				   rightValue == dominoes[event.object.material.name].BottomNumber||
																				   leftValue == -1|| rightValue == -1)
																				   && !event.object.material.fog && Game_Status == "Active" && player==(Turn+1) && event.object.position.y >-2.5){
																				
																					sum -= (dominoes[event.object.material.name].TopNumber + dominoes[event.object.material.name].BottomNumber);
																					handSize--;
																					
																					if(board.length > 0){
																						var l = Math.abs(event.object.position.y-board[0].yPos)+Math.abs(event.object.position.x-board[0].xPos);
																						var r = Math.abs(event.object.position.y-board[board.length-1].yPos)+Math.abs(event.object.position.x-board[board.length-1].xPos);
																					
																						if( r > l)
																							playDomino(event.object.material.name,"Left",handSize);
																						else 
																							playDomino(event.object.material.name,"Right",handSize);
																						//console.log(l+" ~ R:"+r);
																					}
																					else playDomino(event.object.material.name,"Left",handSize);
																					event.object.material.fog = true;
																					
																					scene.remove(event.object);
																					
																				}
																				else{
																					console.log("Try again later.... noob... its Player "+(Turn+1)+" turn");
																					event.object.position.y = placeHolderHeight;
																					console.log("leftValue:"+leftValue+" and the rightValue:"+rightValue);
																					console.log("TopNumber:"+dominoes[event.object.material.name].TopNumber);
																					console.log("BottomNumber:"+dominoes[event.object.material.name].BottomNumber);
																					console.log("Dominoe Name"+event.object.material.name);
																					
																				}
																				console.log();
																			});
																			
																			
				//https://www.learnthreejs.com/drag-drop-dragcontrols-mouse/
		}
		
		function shuffle(){
			var space = 2.55;
			leftValue = -1;
			rightValue = -1;			
			objects = [];
			board = [];
			
			
			//First Dominoes
			Dominoe1 =  new THREE.Sprite();
			scene.add( Dominoe1 );
			objects.push(Dominoe1);
			
			//Second Dominoes
			Dominoe2 =  new THREE.Sprite();
			scene.add( Dominoe2 );
			objects.push(Dominoe2);
			
			//Third Dominoes
			Dominoe3 =  new THREE.Sprite();
			scene.add( Dominoe3 );
			objects.push(Dominoe3);
			
			//Fourth Dominoes
			Dominoe4 =  new THREE.Sprite();
			scene.add( Dominoe4 );
			objects.push(Dominoe4);
			
			//Fifth Dominoes
			Dominoe5 =  new THREE.Sprite();
			scene.add( Dominoe5 );
			objects.push(Dominoe5);
			
			//Sixth Dominoes
			Dominoe6 =  new THREE.Sprite();
			scene.add( Dominoe6 );	
			objects.push(Dominoe6);
			
			//Seventh Dominoes
			Dominoe7 =  new THREE.Sprite();
			scene.add( Dominoe7 );
			objects.push(Dominoe7);
			
			
			var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );

				dragControls.addEventListener( 'dragstart', function(event) {
																			controls.enabled = false;
																			
																			});
																			
				dragControls.addEventListener( 'dragend', function(event)   {
																			controls.enabled = true;
																			
																			});
			
			
			for(var x=1; x < 8; x++){
				var a = Math.floor(Math.random()*100);
				a = a % DominoesAmount;
				var temp= -1;
				
				
				//Go to for the function to return to if the domino is already taken
				
				
				while (temp == -1){
						if(dominoes[a].Status != "available"){
							a = (a+1) % DominoesAmount;
						}
						else{
							temp = dominoes[a].Sprite;
							dominoes[a].Status = "taken";
							//console.log("Domino " + a)
						}
				}					
				
				
				if(x==1){
					Dominoe1.material=temp;
					Dominoe1.material.name=a;
					Dominoe1.material.rotation=Math.PI/2;
					Dominoe1.scale.set(1.75,1.75,1);
					Dominoe1.position.set( -7.75,placeHolderHeight,35 );	
					numberOfDominoes--;
				}
				else if(x==2){
					Dominoe2.material=temp;
					Dominoe2.material.name=a;
					Dominoe2.material.rotation=Math.PI/2;
					Dominoe2.scale.set(1.75,1.75,1);
					Dominoe2.position.set( -7.75 +space*1,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==3){
					Dominoe3.material=temp;
					Dominoe3.material.name=a;
					Dominoe3.material.rotation=Math.PI/2;
					Dominoe3.scale.set(1.75,1.75,1);
					Dominoe3.position.set( -7.75 +space*2,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==4){
					Dominoe4.material=temp;
					Dominoe4.material.name=a;
					Dominoe4.material.rotation=Math.PI/2;
					Dominoe4.scale.set(1.75,1.75,1);
					Dominoe4.position.set( -7.75 +space*3,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==5){
					Dominoe5.material=temp;
					Dominoe5.material.name=a;
					Dominoe5.material.rotation=Math.PI/2;
					Dominoe5.scale.set(1.75,1.75,1);
					Dominoe5.position.set( -7.75 +space*4,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==6){
					Dominoe6.material=temp;
					Dominoe6.material.name=a;
					Dominoe6.material.rotation=Math.PI/2;
					Dominoe6.scale.set(1.75,1.75,1);
					Dominoe6.position.set( -7.75 +space*5,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==7){
					Dominoe7.material=temp;
					Dominoe7.material.name=a;
					Dominoe7.material.rotation=Math.PI/2;
					Dominoe7.scale.set(1.75,1.75,1);
					Dominoe7.position.set( -7.75 +space*6,placeHolderHeight,35 );
					numberOfDominoes--;
				}
			}
			console.log(" ");
			console.log("Dominoes left: "+numberOfDominoes);
		}	
		
		function new_Hand(){ // total points of dominoes
			//First remove leftover dominoes -.-
			//Dominoe1 Removal
			if(dominoes[Dominoe1.material.name].Status != "board"){
				points -= dominoes[Dominoe1.material.name].TopNumber;
				points -= dominoes[Dominoe1.material.name].BottomNumber;
				console.log("Points after Dominoe1 =" + points);
				
				objects.splice(0,1);;
				scene.remove(Dominoe1);
				removed++;
			}
			//Dominoe2 Removal
			if(dominoes[Dominoe2.material.name].Status != "board"){
				points = points - dominoes[Dominoe2.material.name].TopNumber;
				points = points - dominoes[Dominoe2.material.name].BottomNumber;
				console.log("Points after Dominoe2 =" + points);
				
				var x,found=false;
				//Can't gurantee where it will be in the objects array -.-
				for(x = 0; x<objects.length & !found;x++){
					if(objects[x]==Dominoe2){
						objects.splice(0,1);;
						scene.remove(Dominoe2);
						found=true;
					}
				}
				removed++;
			}
			//Dominoe3 Removal
			if(dominoes[Dominoe3.material.name].Status != "board"){
				points = points - dominoes[Dominoe3.material.name].TopNumber;
				points = points - dominoes[Dominoe3.material.name].BottomNumber;
				console.log("Points after Dominoe3 =" + points);
				
				var x,found=false;
				//Can't gurantee where it will be in the objects array -.-
				for(x = 0; x<objects.length & !found;x++){
					if(objects[x]==Dominoe3){
						objects.splice(0,1);;
						scene.remove(Dominoe3);
						found=true;
					}
				}
				removed++;
			}
			//Dominoe4 Removal
			if(dominoes[Dominoe4.material.name].Status != "board"){
				points = points - dominoes[Dominoe4.material.name].TopNumber;
				points = points - dominoes[Dominoe4.material.name].BottomNumber;
				console.log("Points after Dominoe4 =" + points);
				
				var x,found=false;
				//Can't gurantee where it will be in the objects array -.-
				for(x = 0; x<objects.length & !found;x++){
					if(objects[x]==Dominoe4){
						objects.splice(0,1);;
						scene.remove(Dominoe4);
						found=true;
					}
				}
				removed++;
			}
			//Dominoe5 Removal
			if(dominoes[Dominoe5.material.name].Status != "board"){
				points = points - dominoes[Dominoe5.material.name].TopNumber;
				points = points - dominoes[Dominoe5.material.name].BottomNumber;
				console.log("Points after Dominoe5 =" + points);
				
				var x,found=false;
				//Can't gurantee where it will be in the objects array -.-
				for(x = 0; x<objects.length & !found;x++){
					if(objects[x]==Dominoe5){
						objects.splice(0,1);;
						scene.remove(Dominoe5);
						found=true;
					}
				}
				removed++;
			}
			//Dominoe6 Removal
			if(dominoes[Dominoe6.material.name].Status != "board"){
				points = points - dominoes[Dominoe6.material.name].TopNumber;
				points = points - dominoes[Dominoe6.material.name].BottomNumber;
				console.log("Points after Dominoe6 =" + points);
				
				var x,found=false;
				//Can't gurantee where it will be in the objects array -.-
				for(x = 0; x<objects.length & !found;x++){
					if(objects[x]==Dominoe6){
						objects.splice(0,1);;
						scene.remove(Dominoe6);
						found=true;
					}
				}
				removed++;
			}
			//Dominoe7 Removal
			if(dominoes[Dominoe7.material.name].Status != "board"){					
				points = points - dominoes[Dominoe7.material.name].TopNumber;
				points = points - dominoes[Dominoe7.material.name].BottomNumber;
				console.log("Points after Dominoe7 =" + points);
				
				var x,found=false;
				objects.splice(objects.length-1,1);;
				scene.remove(Dominoe7);
				removed++;
			}
			
			
			console.log(removed + " dominoes were removed from Play");
			console.log("Points =" + points);
			
			
			
			
			//Now we get a new hand
			var space = 2.55;
			
			//First Dominoes
			Dominoe1 =  new THREE.Sprite();
			scene.add( Dominoe1 );
			objects.push(Dominoe1);
			
			//Second Dominoes
			Dominoe2 =  new THREE.Sprite();
			scene.add( Dominoe2 );
			objects.push(Dominoe2);
			
			//Third Dominoes
			Dominoe3 =  new THREE.Sprite();
			scene.add( Dominoe3 );
			objects.push(Dominoe3);
			
			//Fourth Dominoes
			Dominoe4 =  new THREE.Sprite();
			scene.add( Dominoe4 );
			objects.push(Dominoe4);
			
			//Fifth Dominoes
			Dominoe5 =  new THREE.Sprite();
			scene.add( Dominoe5 );
			objects.push(Dominoe5);
			
			//Sixth Dominoes
			Dominoe6 =  new THREE.Sprite();
			scene.add( Dominoe6 );
			objects.push(Dominoe6);
			
			//Seventh Dominoes
			Dominoe7 =  new THREE.Sprite();
			scene.add( Dominoe7 );
			objects.push(Dominoe7);
			
			
			var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );

				dragControls.addEventListener( 'dragstart', function(event) {
																			controls.enabled = false;
																			
																			});
																			
				dragControls.addEventListener( 'dragend', function(event)   {
																			controls.enabled = true;
																			
																			});
			
			
			for(var x=1; x < 8; x++){
				
				var a = Math.floor(Math.random()*100);
				a = a % DominoesAmount;
				var temp= -1;
				
				
				//Go to for the function to return to if the domino is already taken
				
				
				while (temp == -1){
						if(dominoes[a].Status != "available"){
							a = (a+1) % DominoesAmount;
						}
						else{
							temp = dominoes[a].Sprite;
							dominoes[a].Status = "taken";
						}
				}					
				
				
				if(x==1){
					Dominoe1.material=temp;
					Dominoe1.material.name=a;
					Dominoe1.material.rotation=Math.PI/2;
					Dominoe1.scale.set(1.75,1.75,1);
					Dominoe1.position.set( -7.75,placeHolderHeight,35 );	
					numberOfDominoes--;
				}
				else if(x==2){
					Dominoe2.material=temp;
					Dominoe2.material.name=a;
					Dominoe2.material.rotation=Math.PI/2;
					Dominoe2.scale.set(1.75,1.75,1);
					Dominoe2.position.set( -7.75 +space*1,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==3){
					Dominoe3.material=temp;
					Dominoe3.material.name=a;
					Dominoe3.material.rotation=Math.PI/2;
					Dominoe3.scale.set(1.75,1.75,1);
					Dominoe3.position.set( -7.75 +space*2,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==4){
					Dominoe4.material=temp;
					Dominoe4.material.name=a;
					Dominoe4.material.rotation=Math.PI/2;
					Dominoe4.scale.set(1.75,1.75,1);
					Dominoe4.position.set( -7.75 +space*3,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==5){
					Dominoe5.material=temp;
					Dominoe5.material.name=a;
					Dominoe5.material.rotation=Math.PI/2;
					Dominoe5.scale.set(1.75,1.75,1);
					Dominoe5.position.set( -7.75 +space*4,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==6){
					Dominoe6.material=temp;
					Dominoe6.material.name=a;
					Dominoe6.material.rotation=Math.PI/2;
					Dominoe6.scale.set(1.75,1.75,1);
					Dominoe6.position.set( -7.75 +space*5,placeHolderHeight,35 );
					numberOfDominoes--;
				}
				else if(x==7){
					Dominoe7.material=temp;
					Dominoe7.material.name=a;
					Dominoe7.material.rotation=Math.PI/2;
					Dominoe7.scale.set(1.75,1.75,1);
					Dominoe7.position.set( -7.75 +space*6,placeHolderHeight,35 );
					numberOfDominoes--;
				}
			}
			//console.log(" ");
			console.log("Dominoes left: "+numberOfDominoes);
		}	
		
		function addToBoardfromServer(dominoNumber,preferred_side,playerDomino){
			
			//Control Variables to Change the Scaling
			var sidewaysX = 2.8;
			var sidewaysY = 0.6;
			var straightX = 1.1;
			var straightY = 1.3;
			
			//New Positions Variables
			var xPos = 0;
			var yPos = 1;
			
			//Wall Limits
			var LeftWall = -5.4;
			var TopWall = 4;
			var BottomWall = -2;
			var RightWall = 5.9;
			
			//console.log("X: " + e.position.x);
			//Load Sprite for Dominoe
			
			/*
			var D = {
						TopNumber:dominoes[dominoNumber].TopNumber,
						BottomNumber:dominoes[dominoNumber].BottomNumber,
						Status: "board",
						Sprite: dominoes[dominoNumber].Sprite,
						xPos:0,
						yPos:0,
						Position:"straight up"}
						*/
			
			var Spir =  new THREE.Sprite();
			Spir.material = dominoes[dominoNumber].Sprite;
			Spir.material.name = dominoNumber;
			Spir.material.rotation=Math.PI/2;
			Spir.scale.set(1.75,1.75,1);
			
			scene.add(Spir);
			
			//Domino Positioning
			//is it straight up or sideways
			var Pos = "side way";
			//Position:"straight up"
			//Position:"side"
			

			
			
			//If the Board is still empty and this will be the first domino
			if(leftValue == -1){
				leftValue = dominoes[dominoNumber].TopNumber;
				rightValue = dominoes[dominoNumber].BottomNumber;
				console.log("First Domino Played");
				
				//If the first domino is a double
				if(dominoes[dominoNumber].TopNumber == dominoes[dominoNumber].BottomNumber){
					//console.log("Double");
					Spir.scale.set(straightX,straightY,1);
					Pos = "straight up";
					//board[0].Position = "straight up";
				}
				//Otherwise if the first domino is not a double
				else{						
					Spir.material.rotation=0/2;
					Spir.material.name=dominoNumber;
					Spir.scale.set(sidewaysX,sidewaysY,1);
					Pos = "side way";
					//console.log("-Not a double");						
				}						
				CenterPiece=0;
				board.unshift(Spir);
				board[0].xPos = xPos;
				board[0].yPos = yPos;
				board[0].Player = playerDomino;
				board[0].Position = Pos;
			}				
			
			//LEFT HAND SIDE
			//Adding the domino to the left hand side of the board
			else if((leftValue == dominoes[dominoNumber].TopNumber ||
					leftValue == dominoes[dominoNumber].BottomNumber) && !((preferred_side == "Right") && ((rightValue == dominoes[dominoNumber].TopNumber) ||
					(rightValue == dominoes[dominoNumber].BottomNumber)))){
				CenterPiece++;
				dominoes[dominoNumber].Status = "board";					
				
				//3) DOUBLE ON THE LEFT HAND SIDE
				if(leftValue == dominoes[dominoNumber].TopNumber &&
				  (dominoes[dominoNumber].TopNumber == dominoes[dominoNumber].BottomNumber) &&
				  board[0].xPos >= LeftWall && board[0].yPos==yPos){
					Spir.scale.set(straightX,straightY,1);
					Spir.material.rotation=Math.PI/2;						
					leftValue = dominoes[dominoNumber].BottomNumber;
					xPos = board[0].xPos - sidewaysX + 0.6;
					yPos = board[0].yPos;
					Pos = "straight up";
				}					
				//5) Connecting to DOUBLE on the LEFT HAND SIDE
				else if(board[0].xPos >= LeftWall && board[0].yPos == yPos && 
						(dominoes[board[0].material.name].TopNumber == dominoes[board[0].material.name].BottomNumber)){
							
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation=0/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=Math.PI;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							
							Spir.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[0].xPos - sidewaysX + 0.7;
							yPos = board[0].yPos;								
				  }			
				//2) Connecting to sideways to a domino
				else if(board[0].xPos >= LeftWall && board[0].yPos == yPos ){
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation=0/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = Math.PI;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[0].xPos - sidewaysX-0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);
				 }
				//21) Connecting at bottom left then going upwards
				else if(board[0].xPos <= LeftWall && board[0].yPos == yPos &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=Math.PI/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = -Math.PI/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[0].yPos + sidewaysY+0.3;
							xPos = board[0].xPos - sidewaysX/4;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//7) Connecting upwards
				else if(board[0].xPos <= LeftWall && board[0].yPos < TopWall &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=Math.PI/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = -Math.PI/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[0].yPos + straightY -0.15;
							xPos = board[0].xPos;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//15) From upwards to the right
				else if(board[0].xPos <= LeftWall && board[0].yPos >= TopWall &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=0/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
					
							yPos = board[0].yPos + straightY/5;
							xPos = board[0].xPos + straightX + 1;
							Spir.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }					  
				//2) Connecting to sideways to a domino towards the right!!!!!
				else if(board[0].xPos < RightWall && board[0].yPos > TopWall ){
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=0/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[0].xPos + sidewaysX+0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);
					}
				//24) Connecting at top right then goes downwards
				else if(board[0].xPos >= RightWall && board[0].yPos > TopWall &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= -Math.PI/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[0].yPos - sidewaysY-0.3;
							xPos = board[0].xPos + sidewaysX/4;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";						
				  }
				//8) Connecting downwards
				else if(board[0].xPos >= RightWall && board[0].yPos > yPos+2 &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= -Math.PI/2;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[0].yPos - straightY +0.15;
							xPos = board[0].xPos;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";								
				  }
				//15) From downwards to the left
				else if(board[0].xPos >= LeftWall && board[0].yPos > yPos &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation=0/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = Math.PI;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
					
							yPos = board[0].yPos - straightY/5;
							xPos = board[0].xPos - straightX - 1;
							Spir.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }			
				//Continuing Left
				else if(board[0].xPos > LeftWall && board[0].yPos > yPos &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = 0/2;
								leftValue = dominoes[dominoNumber].TopNumber;
							}
							else if(leftValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = Math.PI;
								leftValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[0].xPos - sidewaysX-0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);					
				  }
				//If the bottomNumber of this domino matches
				else{
							Spir.material.rotation=0/2;
							Spir.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[0].xPos - sidewaysX;
							yPos = board[0].yPos;
							leftValue = dominoes[e.material.name].TopNumber;
							console.log("Left Side-Bottom Match");	
				}
				
				//Adding the Domino Sprite to the Board
				board.unshift(Spir);
				//PLACING THE Domino
				board[0].xPos = xPos;
				board[0].yPos = yPos;
				board[0].Position = Pos;
				board[0].Player = playerDomino;
			}
			
			//Right Hand Side
			else if(rightValue == dominoes[dominoNumber].TopNumber ||
					rightValue == dominoes[dominoNumber].BottomNumber){
				dominoes[dominoNumber].Status = "board";
				
				//3) DOUBLE ON THE RIGHT HAND SIDE
				if(rightValue == dominoes[dominoNumber].TopNumber &&
				  (dominoes[dominoNumber].TopNumber == dominoes[dominoNumber].BottomNumber) &&
				  board[board.length-1].xPos <= RightWall && board[board.length-1].yPos==yPos){
					Spir.scale.set(straightX,straightY,1);
					Spir.material.rotation=Math.PI/2;						
					rightValue = dominoes[dominoNumber].BottomNumber;
					xPos = board[board.length-1].xPos + sidewaysX - 0.6;
					yPos = board[board.length-1].yPos;
					Pos = "straight up";
				}
				//5) Connecting to DOUBLE on the LEFT HAND SIDE
				else if(board[board.length-1].xPos <= RightWall && board[board.length-1].yPos == yPos && 
						(dominoes[board[board.length-1].material.name].TopNumber == dominoes[board[board.length-1].material.name].BottomNumber)){
							
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation=Math.PI;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation=0/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							
							Spir.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[board.length-1].xPos + sidewaysX - 0.7;
							yPos = board[board.length-1].yPos;								
				  }
				//2) Connecting to sideways to a domino
				else if(board[board.length-1].xPos <= RightWall && board[board.length-1].yPos == yPos ){
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = 0/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[board.length-1].xPos + sidewaysX+0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);
				  }
				//21) Connecting at bottom right then going downwards
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos == yPos &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= -Math.PI/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[board.length-1].yPos - sidewaysY-0.3;
							xPos = board[board.length-1].xPos + sidewaysX/4;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//7) Connecting downwards
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos > BottomWall &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= -Math.PI/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[board.length-1].yPos - straightY +0.15;
							xPos = board[board.length-1].xPos;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";			
				  }					
				 //15) From downwards to the left
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos <= BottomWall &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = 0/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = Math.PI;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
					
							yPos = board[board.length-1].yPos - straightY/5;
							xPos = board[board.length-1].xPos - straightX - 1;
							Spir.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }		
				 //2) Connecting to sideways to a domino towards the left!!!!!
				else if(board[board.length-1].xPos > LeftWall && board[board.length-1].yPos < BottomWall ){
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = 0/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = Math.PI;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[board.length-1].xPos - sidewaysX - 0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);
					}
				//24) Connecting at bottom left then goes upwards
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < BottomWall &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= Math.PI/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = -Math.PI/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[board.length-1].yPos + sidewaysY+0.3;
							xPos = board[board.length-1].xPos - sidewaysX/4;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";						
				  }					 
				//8) Connecting upwards
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < yPos-2 &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation= Math.PI/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							else if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = -Math.PI/2;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
					
							yPos = board[board.length-1].yPos + straightY -0.15;
							xPos = board[board.length-1].xPos;
							Spir.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				 //15) From downwards to the left
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < yPos &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation= Math.PI;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = 0/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
					
							yPos = board[board.length-1].yPos + straightY/5;
							xPos = board[board.length-1].xPos + straightX + 1;
							Spir.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }		
				//Continuing Right
				else if(board[board.length-1].xPos < RightWall && board[board.length-1].yPos < yPos &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[dominoNumber].BottomNumber){
								Spir.material.rotation = Math.PI;
								rightValue = dominoes[dominoNumber].TopNumber;
							}
							else if(rightValue == dominoes[dominoNumber].TopNumber){
								Spir.material.rotation = 0/2;
								rightValue = dominoes[dominoNumber].BottomNumber;
							}
							xPos = board[board.length-1].xPos + sidewaysX+0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							Spir.scale.set(sidewaysX,sidewaysY,1);					
				  }
				  
				//Adding the Domino Sprite to the Board
				board.push(Spir);
				//PLACING THE Domino
				board[board.length-1].xPos = xPos;
				board[board.length-1].yPos = yPos;
				board[board.length-1].Position = Pos;
				board[board.length-1].Player = playerDomino;
			}
			reDraw_Board();
		}
		
		function addToBoard(e){
			//Control Variables to Change the Scaling
			var sidewaysX=2.8;
			var sidewaysY=0.6;
			var straightX=1.1;
			var straightY=1.3;
			
			//New Positions Variables
			var xPos=0;
			var yPos=1;
			
			//Wall Limits
			var LeftWall = -5.5;
			var TopWall = 4;
			var BottomWall = -2;
			var RightWall = 5;
			
			//Domino Positioning
			//is it straight up or sideways
			var Pos = "side way";
			//Position:"straight up"}

			
			
			//If the Board is still empty and this will be the first domino
			if(leftValue == -1){
				leftValue = dominoes[e.material.name].TopNumber;
				rightValue = dominoes[e.material.name].BottomNumber;
				console.log("First Domino Played");
				dominoes[e.material.name].Status = "board";
				
				//xPos = 0;
				//yPos = 2;
				
				//Removes domino from the player hand
				for(var x=0;x<objects.length;x++)
					if(objects[x].material.name == e.material.name){
						board.push(objects[x]);
						objects.splice(x,1);
						
						//PLACING THE Domino
						board[0].xPos = xPos;
						board[0].yPos = yPos;
					}
				
				//If the first domino is a double
				if(dominoes[e.material.name].TopNumber == dominoes[e.material.name].BottomNumber){
					console.log("double");
					dominoes[e.material.name].Status = "board";
					e.scale.set(straightX,straightY,1);
					Pos = "straight up";
				}
				//Otherwise if the first domino is not a double
				else{						
					e.material.rotation=0/2;
					e.scale.set(sidewaysX,sidewaysY,1);
					Pos = "side way";				
				}						
				CenterPiece=0;
			}				
			
			//LEFT HAND SIDE
			//Adding the domino to the left hand side of the board
			else if(leftValue == dominoes[e.material.name].TopNumber ||
					leftValue == dominoes[e.material.name].BottomNumber){
				CenterPiece++;
				dominoes[e.material.name].Status = "board";					
				
				//3) DOUBLE ON THE LEFT HAND SIDE
				if(leftValue == dominoes[e.material.name].TopNumber &&
				  (dominoes[e.material.name].TopNumber == dominoes[e.material.name].BottomNumber) &&
				  board[0].xPos >= LeftWall && board[0].yPos==yPos){
					e.scale.set(straightX,straightY,1);
					e.material.rotation=Math.PI/2;						
					leftValue = dominoes[e.material.name].BottomNumber;
					xPos = board[0].xPos - sidewaysX + 0.6;
					yPos = board[0].yPos;
					Pos = "straight up";
				}					
				//5) Connecting to DOUBLE on the LEFT HAND SIDE
				else if(board[0].xPos >= LeftWall && board[0].yPos == yPos && 
						(dominoes[board[0].material.name].TopNumber == dominoes[board[0].material.name].BottomNumber)){
							
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation=0/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=Math.PI;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							
							e.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[0].xPos - sidewaysX + 0.7;
							yPos = board[0].yPos;								
				  }			
				//2) Connecting to sideways to a domino
				else if(board[0].xPos >= LeftWall && board[0].yPos == yPos ){
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation=0/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = Math.PI;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[0].xPos - sidewaysX-0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);
				 }
				//21) Connecting at bottom left then going upwards
				else if(board[0].xPos <= LeftWall && board[0].yPos == yPos &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=Math.PI/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							else if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = -Math.PI/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[0].yPos + sidewaysY+0.3;
							xPos = board[0].xPos - sidewaysX/4;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//7) Connecting upwards
				else if(board[0].xPos <= LeftWall && board[0].yPos < TopWall &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=Math.PI/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							else if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = -Math.PI/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[0].yPos + straightY -0.15;
							xPos = board[0].xPos;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//15) From upwards to the right
				else if(board[0].xPos <= LeftWall && board[0].yPos >= TopWall &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=0/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
					
							yPos = board[0].yPos + straightY/5;
							xPos = board[0].xPos + straightX + 1;
							e.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }					  
				//2) Connecting to sideways to a domino towards the right!!!!!
				else if(board[0].xPos < RightWall && board[0].yPos > TopWall ){
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=0/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[0].xPos + sidewaysX+0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);
					}
				//24) Connecting at top right then goes downwards
				else if(board[0].xPos >= RightWall && board[0].yPos > TopWall &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= -Math.PI/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							else if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[0].yPos - sidewaysY-0.3;
							xPos = board[0].xPos + sidewaysX/4;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";						
				  }
				//8) Connecting downwards
				else if(board[0].xPos >= RightWall && board[0].yPos > yPos+2 &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= -Math.PI/2;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							else if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[0].yPos - straightY +0.15;
							xPos = board[0].xPos;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";								
				  }
				//15) From downwards to the left
				else if(board[0].xPos >= LeftWall && board[0].yPos > yPos &&
					  board[0].Position == "straight up"){
						  
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation=0/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = Math.PI;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
					
							yPos = board[0].yPos - straightY/5;
							xPos = board[0].xPos - straightX - 1;
							e.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }			
				//Continuing Left
				else if(board[0].xPos > LeftWall && board[0].yPos > yPos &&
					  board[0].Position == "side way"){
						  
							if(leftValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = 0/2;
								leftValue = dominoes[e.material.name].TopNumber;
							}
							else if(leftValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = Math.PI;
								leftValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[0].xPos - sidewaysX-0.1;
							yPos = board[0].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);					
				  }					
				
				/**
				//If the bottomNumber of this domino matches
				else{
							e.material.rotation=0/2;
							e.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[0].xPos - sidewaysX;
							yPos = board[0].yPos;
							leftValue = dominoes[e.material.name].TopNumber;
							console.log("Left Side-Bottom Match");	
				}
				*/
				
				//Removes domino from the player hand
				for(var x=0; x<objects.length; x++)
					if(objects[x].material.name == e.material.name){
						board.unshift(objects[x]);							
						objects.splice(x,1);
						
						//PLACING THE Domino
						board[0].xPos = xPos;
						board[0].yPos = yPos;
						board[0].Position = Pos;
					}
			}
			
			//Right Hand Side
			else if(rightValue == dominoes[e.material.name].TopNumber ||
					rightValue == dominoes[e.material.name].BottomNumber){
				dominoes[e.material.name].Status = "board";
				
				//3) DOUBLE ON THE RIGHT HAND SIDE
				if(rightValue == dominoes[e.material.name].TopNumber &&
				  (dominoes[e.material.name].TopNumber == dominoes[e.material.name].BottomNumber) &&
				  board[board.length-1].xPos <= RightWall && board[board.length-1].yPos==yPos){
					e.scale.set(straightX,straightY,1);
					e.material.rotation=Math.PI/2;						
					rightValue = dominoes[e.material.name].BottomNumber;
					xPos = board[board.length-1].xPos + sidewaysX - 0.6;
					yPos = board[board.length-1].yPos;
					Pos = "straight up";
				}
				//5) Connecting to DOUBLE on the LEFT HAND SIDE
				else if(board[board.length-1].xPos <= RightWall && board[board.length-1].yPos == yPos && 
						(dominoes[board[board.length-1].material.name].TopNumber == dominoes[board[board.length-1].material.name].BottomNumber)){
							
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation=Math.PI;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation=0/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							
							e.scale.set(sidewaysX,sidewaysY,1);
							xPos = board[board.length-1].xPos + sidewaysX - 0.7;
							yPos = board[board.length-1].yPos;								
				  }
				//2) Connecting to sideways to a domino
				else if(board[board.length-1].xPos <= RightWall && board[board.length-1].yPos == yPos ){
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = 0/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[board.length-1].xPos + sidewaysX+0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);
				  }
				//21) Connecting at bottom right then going downwards
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos == yPos &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= -Math.PI/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							else if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[board.length-1].yPos - sidewaysY-0.3;
							xPos = board[board.length-1].xPos + sidewaysX/4;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				//7) Connecting downwards
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos > BottomWall &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= -Math.PI/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							else if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[board.length-1].yPos - straightY +0.15;
							xPos = board[board.length-1].xPos;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";			
				  }					
				 //15) From downwards to the left
				else if(board[board.length-1].xPos >= RightWall && board[board.length-1].yPos <= BottomWall &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = 0/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = Math.PI;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
					
							yPos = board[board.length-1].yPos - straightY/5;
							xPos = board[board.length-1].xPos - straightX - 1;
							e.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }		
				 //2) Connecting to sideways to a domino towards the left!!!!!
				else if(board[board.length-1].xPos > LeftWall && board[board.length-1].yPos < BottomWall ){
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = 0/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = Math.PI;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[board.length-1].xPos - sidewaysX - 0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);
					}
				//24) Connecting at bottom left then goes upwards
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < BottomWall &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= Math.PI/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							else if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = -Math.PI/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[board.length-1].yPos + sidewaysY+0.3;
							xPos = board[board.length-1].xPos - sidewaysX/4;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";						
				  }					 
				//8) Connecting upwards
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < yPos-2 &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation= Math.PI/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							else if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = -Math.PI/2;
								rightValue = dominoes[e.material.name].TopNumber;
							}
					
							yPos = board[board.length-1].yPos + straightY -0.15;
							xPos = board[board.length-1].xPos;
							e.scale.set(straightX,straightY,1);
							Pos = "straight up";							
				  }
				 //15) From downwards to the left
				else if(board[board.length-1].xPos <= LeftWall && board[board.length-1].yPos < yPos &&
					  board[board.length-1].Position == "straight up"){
						  
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation= Math.PI;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = 0/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
					
							yPos = board[board.length-1].yPos + straightY/5;
							xPos = board[board.length-1].xPos + straightX + 1;
							e.scale.set(sidewaysX,sidewaysY,1);
							Pos = "side way";						
				  }		
				//Continuing Right
				else if(board[board.length-1].xPos < RightWall && board[board.length-1].yPos < yPos &&
					  board[board.length-1].Position == "side way"){
						  
							if(rightValue == dominoes[e.material.name].BottomNumber){
								e.material.rotation = Math.PI;
								rightValue = dominoes[e.material.name].TopNumber;
							}
							else if(rightValue == dominoes[e.material.name].TopNumber){
								e.material.rotation = 0/2;
								rightValue = dominoes[e.material.name].BottomNumber;
							}
							xPos = board[board.length-1].xPos + sidewaysX+0.1;
							yPos = board[board.length-1].yPos;
							Pos = "side way";
							e.scale.set(sidewaysX,sidewaysY,1);					
				  }
				  
				//Removes domino from the player hand
				for(var x=0;x<objects.length;x++)
					if(objects[x].material.name == e.material.name){
						board.push(objects[x]);
						objects.splice(x,1);
						
						//PLACING THE Domino
						board[board.length-1].xPos = xPos;
						board[board.length-1].yPos = yPos;
						board[board.length-1].Position = Pos;
					}						
			}
			reDraw_Board();
		}
		
		function reDraw_Board(){
			for(var x = 0; x <board.length; x++){
					//DominoesStyle==0
					//Color Themes for the Domino
					if(DominoesStyle == 0){//Normal Dominoes with No color adjustments
						board[x].material.color.setHex(0xffffff); //RGB No Colors
					}
					else if(DominoesStyle == 1){//Force True Statement
						//Colors each domino depending on which player played it
						if(board[x].Player == 0)
							board[x].material.color.setHex(0xF2797B); //RGB Light Red for Player 1 Dominoes
						else if(board[x].Player == 1)
							board[x].material.color.setHex(0x88E0F9); //RGB Light Blue for Player 2 Dominoes
						else if(board[x].Player == 2)
							board[x].material.color.setHex(0x5AED5D); //RGB Light Green for Player 3 Dominoes
						else if(board[x].Player == 3)
							board[x].material.color.setHex(0xB35DF5); //RGB Light Purple for Player 4 Dominoes
						else
							board[x].material.color.setHex(0xffffff); //RGB No Colors
					}
					else if(DominoesStyle == 2){//The ends of the dominoes will be a different color
						if((x >= 1) && (x < (board.length-1)))
							board[x].material.color.setHex(0xffffff); //RGB No Colors
						if((x == 0) || (x == (board.length-1))) board[x].material.color.setHex(0xffcc00); //RGB Colors
					}
					//Skipping this style for now until I find a good wait to apply it or make it look nice
					else if(DominoesStyle == 3){//Force False Statement
						//Color for the Center Domino Piece
						if( x == CenterPiece)//RGB
							board[x].material.color.setHex(0xA9FA66);							
						//Color for Doubles
						else if(dominoes[board[x].material.name].BottomNumber == dominoes[board[x].material.name].TopNumber)
							board[x].material.color.setHex(0x88E0F9); //RGB Light Blue
						else
							board[x].material.color.setHex(0xffffff); //RGB No Colors
						
						board[x].position.set(board[x].xPos, board[x].yPos, 35);
					}
					
					//Sets the Domino
					board[x].position.set(board[x].xPos, board[x].yPos, 35);
				}				
		}
		
		function loadSprites(){
			//Sprites			
				//Loader for sprites
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
					
				//Loading All the Dominoes
				/*
						[0-0] is a side way domino
						---
						 0
						 -	  is straight up domino
						 0
						---
				*/
				//00
				var Texture00 = loader.load( 'Pictures/00.png' );
				Texture00.minFilter = THREE.LinearFilter;
				var Sprite00 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:0, Status: "available", Sprite: Sprite00, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//01
				var Texture01 = loader.load( 'Pictures/01.png' );
				Texture01.minFilter = THREE.LinearFilter;
				var Sprite01 =  new THREE.SpriteMaterial( { map: Texture01, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:1, Status: "available", Sprite: Sprite01, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//02
				var Texture02 = loader.load( 'Pictures/02.png' );
				Texture02.minFilter = THREE.LinearFilter;
				var Sprite02 =  new THREE.SpriteMaterial( { map: Texture02, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:2, Status: "available", Sprite: Sprite02, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//03
				var Texture03 = loader.load( 'Pictures/03.png' );
				Texture03.minFilter = THREE.LinearFilter;
				var Sprite03 =  new THREE.SpriteMaterial( { map: Texture03, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:3, Status: "available", Sprite: Sprite03, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//04
				var Texture04 = loader.load( 'Pictures/04.png' );
				Texture04.minFilter = THREE.LinearFilter;
				var Sprite04 =  new THREE.SpriteMaterial( { map: Texture04, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:4, Status: "available", Sprite: Sprite04, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//05
				var Texture05 = loader.load( 'Pictures/05.png' );
				Texture05.minFilter = THREE.LinearFilter;
				var Sprite05 =  new THREE.SpriteMaterial( { map: Texture05, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:5, Status: "available", Sprite: Sprite05, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//06
				var Texture06 = loader.load( 'Pictures/06.png' );
				Texture06.minFilter = THREE.LinearFilter;
				var Sprite06 =  new THREE.SpriteMaterial( { map: Texture06, color: 0xffffff } );
				var D = {TopNumber:0, BottomNumber:6, Status: "available", Sprite: Sprite06, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//11
				var Texture11 = loader.load( 'Pictures/11.png' );
				Texture11.minFilter = THREE.LinearFilter;
				var Sprite11 =  new THREE.SpriteMaterial( { map: Texture11, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:1, Status: "available", Sprite: Sprite11, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//12
				var Texture12 = loader.load( 'Pictures/12.png' );
				Texture12.minFilter = THREE.LinearFilter;
				var Sprite12 =  new THREE.SpriteMaterial( { map: Texture12, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:2, Status: "available", Sprite: Sprite12, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//13
				var Texture13 = loader.load( 'Pictures/13.png' );
				Texture13.minFilter = THREE.LinearFilter;
				var Sprite13 =  new THREE.SpriteMaterial( { map: Texture13, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:3, Status: "available", Sprite: Sprite13, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//14
				var Texture14 = loader.load( 'Pictures/14.png' );
				Texture14.minFilter = THREE.LinearFilter;
				var Sprite14 =  new THREE.SpriteMaterial( { map: Texture14, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:4, Status: "available", Sprite: Sprite14, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//15
				var Texture15 = loader.load( 'Pictures/15.png' );
				Texture15.minFilter = THREE.LinearFilter;
				var Sprite15 =  new THREE.SpriteMaterial( { map: Texture15, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:5, Status: "available", Sprite: Sprite15, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//16
				var Texture16 = loader.load( 'Pictures/16.png' );
				Texture16.minFilter = THREE.LinearFilter;
				var Sprite16 =  new THREE.SpriteMaterial( { map: Texture16, color: 0xffffff } );
				var D = {TopNumber:1, BottomNumber:6, Status: "available", Sprite: Sprite16, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//22
				var Texture22 = loader.load( 'Pictures/22.png' );
				Texture22.minFilter = THREE.LinearFilter;
				var Sprite22 =  new THREE.SpriteMaterial( { map: Texture22, color: 0xffffff } );
				var D = {TopNumber:2, BottomNumber:2, Status: "available", Sprite: Sprite22, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//23
				var Texture23 = loader.load( 'Pictures/23.png' );
				Texture23.minFilter = THREE.LinearFilter;
				var Sprite23 =  new THREE.SpriteMaterial( { map: Texture23, color: 0xffffff } );
				var D = {TopNumber:2, BottomNumber:3, Status: "available", Sprite: Sprite23, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//24
				var Texture24 = loader.load( 'Pictures/24.png' );
				Texture24.minFilter = THREE.LinearFilter;
				var Sprite24 =  new THREE.SpriteMaterial( { map: Texture24, color: 0xffffff } );
				var D = {TopNumber:2, BottomNumber:4, Status: "available", Sprite: Sprite24, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//25
				var Texture25 = loader.load( 'Pictures/25.png' );
				Texture25.minFilter = THREE.LinearFilter;
				var Sprite25 =  new THREE.SpriteMaterial( { map: Texture25, color: 0xffffff } );
				var D = {TopNumber:2, BottomNumber:5, Status: "available", Sprite: Sprite25, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//26
				var Texture26 = loader.load( 'Pictures/26.png' );
				Texture26.minFilter = THREE.LinearFilter;
				var Sprite26 =  new THREE.SpriteMaterial( { map: Texture26, color: 0xffffff } );
				var D = {TopNumber:2, BottomNumber:6, Status: "available", Sprite: Sprite26, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//33
				var Texture33 = loader.load( 'Pictures/33.png' );
				Texture33.minFilter = THREE.LinearFilter;
				var Sprite33 =  new THREE.SpriteMaterial( { map: Texture33, color: 0xffffff } );
				var D = {TopNumber:3, BottomNumber:3, Status: "available", Sprite: Sprite33, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//34
				var Texture34 = loader.load( 'Pictures/34.png' );
				Texture34.minFilter = THREE.LinearFilter;
				var Sprite34 =  new THREE.SpriteMaterial( { map: Texture34, color: 0xffffff } );
				var D = {TopNumber:3, BottomNumber:4, Status: "available", Sprite: Sprite34, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//35
				var Texture35 = loader.load( 'Pictures/35.png' );
				Texture35.minFilter = THREE.LinearFilter;
				var Sprite35 =  new THREE.SpriteMaterial( { map: Texture35, color: 0xffffff } );
				var D = {TopNumber:3, BottomNumber:5, Status: "available", Sprite: Sprite35, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//36
				var Texture36 = loader.load( 'Pictures/36.png' );
				Texture36.minFilter = THREE.LinearFilter;
				var Sprite36 =  new THREE.SpriteMaterial( { map: Texture36, color: 0xffffff } );
				var D = {TopNumber:3, BottomNumber:6, Status: "available", Sprite: Sprite36, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//44
				var Texture44 = loader.load( 'Pictures/44.png' );
				Texture44.minFilter = THREE.LinearFilter;
				var Sprite44 =  new THREE.SpriteMaterial( { map: Texture44, color: 0xffffff } );
				var D = {TopNumber:4, BottomNumber:4, Status: "available", Sprite: Sprite44, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//45
				var Texture45 = loader.load( 'Pictures/45.png' );
				Texture45.minFilter = THREE.LinearFilter;
				var Sprite45 =  new THREE.SpriteMaterial( { map: Texture45, color: 0xffffff } );
				var D = {TopNumber:4, BottomNumber:5, Status: "available", Sprite: Sprite45, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//46
				var Texture46 = loader.load( 'Pictures/46.png' );
				Texture46.minFilter = THREE.LinearFilter;
				var Sprite46 =  new THREE.SpriteMaterial( { map: Texture46, color: 0xffffff } );
				var D = {TopNumber:4, BottomNumber:6, Status: "available", Sprite: Sprite46, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//55
				var Texture55 = loader.load( 'Pictures/55.png' );
				Texture55.minFilter = THREE.LinearFilter;
				var Sprite55 =  new THREE.SpriteMaterial( { map: Texture55, color: 0xffffff } );
				var D = {TopNumber:5, BottomNumber:5, Status: "available", Sprite: Sprite55, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
				//56
				var Texture56 = loader.load( 'Pictures/56.png' );
				Texture56.minFilter = THREE.LinearFilter;
				var Sprite56 =  new THREE.SpriteMaterial( { map: Texture56, color: 0xffffff } );
				var D = {TopNumber:5, BottomNumber:6, Status: "available", Sprite: Sprite56, xPos:0, yPos:0, Position:"side way", Player:-1}
				dominoes.push(D);
				//66
				var Texture66 = loader.load( 'Pictures/66.png' );
				Texture66.minFilter = THREE.LinearFilter;
				var Sprite66 =  new THREE.SpriteMaterial( { map: Texture66, color: 0xffffff } );		
				var D = {TopNumber:6, BottomNumber:6, Status: "available", Sprite: Sprite66, xPos:0, yPos:0, Position:"straight up", Player:-1}
				dominoes.push(D);
		}
		
		function load_Board(){
			//Remove Start Screen
			scene.remove(Start);
			scene.remove(Title1);
			scene.remove(startDominoes1);
			scene.remove(startDominoes2);
			scene.remove(startDominoes3);
			scene.remove(startDominoes4);
			scene.remove(startDominoes5);
			scene.remove(startDominoes6);
			scene.remove(startDominoes7);
			
			Game_Status = "Ready";
			
			//Loader for sprites
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = true;
			
			//Dominoes Board
			//Wood Texture
			Wood = loader.load( 'Pictures/hardwood2_diffuse.jpg' );
			Wood.minFilter = THREE.LinearFilter;
			//Tile Texture
			Tile = loader.load( 'Pictures/FloorsCheckerboard_S_Diffuse.jpg' );
			Tile.minFilter = THREE.LinearFilter;
			//Old Flag Texture
			J1 = loader.load( 'Pictures/oldFlag.jpg' );
			J1.minFilter = THREE.LinearFilter;
			//Partial Flag Texture
			J2 = loader.load( 'Pictures/partialFlag.jpg' );
			J2.minFilter = THREE.LinearFilter;
			
			//Load Board
			var planeGeometry = new THREE.PlaneBufferGeometry (25, 11.25,0);
			var planeMaterial = new THREE.MeshLambertMaterial({color: 0x224522}); //RGB		
			//var planeMaterial =  new THREE.MeshBasicMaterial( { map: Texture, color: 0xffffff } );
			Board = new THREE.Mesh(planeGeometry, planeMaterial);
			Board.position.set(0,1.2,30); //xyz
			scene.add(Board);			
				
			//Dominoes PlaceHolder
			planeGeometry = new THREE.PlaneBufferGeometry (18.5, 2.15,0);
			planeMaterial = new THREE.MeshLambertMaterial({color: 0x000030}); //RGB		
			placeHolder = new THREE.Mesh(planeGeometry, planeMaterial);
			placeHolder.position.set(0, placeHolderHeight,35); //xyz
			scene.add(placeHolder);
			
			//P1 Score
			P1score = new THREEx.DynamicText2DObject();
			P1score.parameters.text= "P1: 0";
			P1score.parameters.font= "70px Arial";
			P1score.parameters.fillStyle= "Red";
			P1score.parameters.align = "center";
			P1score.dynamicTexture.canvas.width = 512;
			P1score.position.set(-8,4.65,35);
			P1score.scale.set(6,3,1);
			P1score.update();
			scene.add(P1score);
			
			//P2 Score
			P2score = new THREEx.DynamicText2DObject()
			P2score.parameters.text= "P2: 0";
			P2score.parameters.font= "70px Arial";
			P2score.parameters.fillStyle= "Blue";
			P2score.parameters.align = "center";
			P2score.dynamicTexture.canvas.width = 512;
			P2score.position.set(-3,4.65,35);
			P2score.scale.set(6,3,1);
			P2score.update();
			scene.add(P2score);
			
			//P3 Score
			P3score = new THREEx.DynamicText2DObject()
			P3score.parameters.text= "P3: 0";
			P3score.parameters.font= "70px Arial";
			P3score.parameters.fillStyle= "Lime";
			P3score.parameters.align = "center";
			P3score.dynamicTexture.canvas.width = 512;
			P3score.position.set(2,4.65,35);
			P3score.scale.set(6,3,1);
			P3score.update();
			scene.add(P3score);
			
			//P4 Score
			P4score = new THREEx.DynamicText2DObject()
			P4score.parameters.text= "P4: 0";
			P4score.parameters.font= "70px Arial";
			P4score.parameters.fillStyle= "Purple";
			P4score.parameters.align = "center";
			P4score.dynamicTexture.canvas.width = 512;
			P4score.position.set(7,4.65,35);
			P4score.scale.set(6,3,1);
			P4score.update();
			scene.add(P4score);
			
			//PlayerNotification
			PlayerNotification = new THREEx.DynamicText2DObject()
			PlayerNotification.parameters.text= ""; //CHANGED
			PlayerNotification.parameters.font= "bolder 185px Arial";
			PlayerNotification.parameters.fillStyle= "white";
			PlayerNotification.parameters.align = "center";
			PlayerNotification.dynamicTexture.canvas.width = 4096;
			PlayerNotification.position.set(0,-4.05,35);
			PlayerNotification.scale.set(11.5,1.25,1);
			PlayerNotification.update();
			scene.add(PlayerNotification);
			
			//BackgroundStyle
			var T = loader.load( 'Pictures/BackgroundStyle4.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			BackgroundStyle = new THREE.Sprite(T1);
			//scene.add(BackgroundStyle);
			BackgroundStyle.position.set(6, 5.95,35);
			BackgroundStyle.scale.set(7,2.1,1);
			scene.add(BackgroundStyle);
			
			//BackgroundStyle.position.set(0,-2.5,35);
			//BackgroundStyle.scale.set(8,2.5,1);
			
			
			BackgroundStyle.callback = function() {
					console.log("Clicked");
					try{
						//Change Board Background
						backgroundDisplay = (backgroundDisplay + 1) % 5;
								
						if(backgroundDisplay == 0)
							Board.material = new THREE.MeshLambertMaterial({color: 0x224522})
						else if(backgroundDisplay == 1)
							Board.material = new THREE.MeshBasicMaterial( { map: Wood, color: 0xffffff } );
						else if(backgroundDisplay == 2)
							Board.material = new THREE.MeshBasicMaterial( { map: Tile, color: 0xffffff } );
						else if(backgroundDisplay == 3)
							Board.material = new THREE.MeshBasicMaterial( { map: J1, color: 0xffffff } );
						else if(backgroundDisplay == 4)
							Board.material = new THREE.MeshBasicMaterial( { map: J2, color: 0xffffff } );							
					}catch(e){
						//functionToHandleError(e);		
						//He HE HE don't say a word if errors happen
					}
			};
			clickable.push(BackgroundStyle);
			
			//DominoStyles
			var T = loader.load( 'Pictures/DominoStyles.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			DominoStyles = new THREE.Sprite(T1);
			scene.add(DominoStyles);
			DominoStyles.scale.set(7,2.1,1);
			DominoStyles.position.set(-7, 5.95,35);
			DominoStyles.callback = function() {
						try{
							//Change Domino Tiles Style
							DominoesStyle = (DominoesStyle + 1) % 3;
							reDraw_Board();						
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
			};
			clickable.push(DominoStyles);
		}
		
		function load_StartScene(){
			var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
			
			var planeGeometry = new THREE.PlaneBufferGeometry (25, 16,0);
			var planeMaterial = new THREE.MeshLambertMaterial({color: 0X3A34B0}); //RGB		
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x7B68EE}); //RGB		
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x4B12BE}); //RGB		
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x0000EE}); //RGB		
			
			var animationOffSwitch=true; //True is off and false is on
			
			Start = new THREE.Mesh(planeGeometry, planeMaterial);
			Start.position.set(0,0,30); //xyz
			Start.receiveShadow = true;
			scene.add(Start);			
			
			
			var T = loader.load( 'Pictures/Title_1.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			Title1 = new THREE.Sprite(T1);				
			
			scene.add(Title1);
			Title1.position.set(0,0,35); 
			Title1.scale.set(19,3.5,1);
			
			var d01 = loader.load( 'Pictures/45.png' );
			d01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
			startDominoes1 = new THREE.Mesh(planeGeometry, planeMaterial);
			if(!animationOffSwitch) scene.add(startDominoes1);
			startDominoes1.rotation.z = Math.PI/2;
			startDominoes1.position.set(-2,-6,30);
			
			
			startDominoes2 = new THREE.Sprite(dominoes[Math.floor(Math.random()*4)+4].Sprite);
			if(!animationOffSwitch) scene.add(startDominoes2);
			startDominoes2.position.set(7,-3.5,30); 
			startDominoes2.material.rotation = Math.PI/2;
			startDominoes2.scale.set(2.25,2.25,1);
			
			d01 = loader.load( 'Pictures/01.png' );
			d01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
			startDominoes3 = new THREE.Mesh(planeGeometry, planeMaterial);
			if(!animationOffSwitch) scene.add(startDominoes3);
			startDominoes3.position.set(-5,-1,30); 
			startDominoes3.rotation.z = Math.PI/2;
			
			startDominoes4 = new THREE.Sprite(dominoes[Math.floor(Math.random()*4)+12].Sprite);
			if(!animationOffSwitch) scene.add(startDominoes4);
			startDominoes4.position.set(5,1.5,30);
			startDominoes4.material.rotation = Math.PI/2;
			startDominoes4.scale.set(2.25,2.25,1);
			
			d01 = loader.load( 'Pictures/66.png' );
			d01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
			startDominoes5 = new THREE.Mesh(planeGeometry, planeMaterial);
			if(!animationOffSwitch) scene.add(startDominoes5);
			startDominoes5.rotation.z = Math.PI/2;
			startDominoes5.position.set(-3,4,30); 
			
			d01 = loader.load( 'Pictures/45.png' );
			d01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
			startDominoes6 = new THREE.Mesh(planeGeometry, planeMaterial);
			if(!animationOffSwitch) scene.add(startDominoes6);
			startDominoes6.rotation.z = Math.PI/2;
			startDominoes6.position.set(-2,6.5,30);
			
			d01 = loader.load( 'Pictures/15.png' );
			d01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
			startDominoes7 = new THREE.Mesh(planeGeometry, planeMaterial);
			if(!animationOffSwitch) scene.add(startDominoes7);
			startDominoes7.rotation.z = Math.PI/2;
			startDominoes7.position.set(-6,9,30);
			Game_Status = "StartScreen";
			//http://flamingtext.com/
		}
		
		function load_HomeScene(){
			Game_Status = "HomeScene";
			
			var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
			
			//Start Game Button
			var T = loader.load( 'Pictures/StartGame.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffff00 } );
			StartGameMesh = new THREE.Sprite(T1);
			scene.add(StartGameMesh);
			StartGameMesh.position.set(0,-0.5,35);
			StartGameMesh.scale.set(11,2,1);
			//Function
			StartGameMesh.callback = function() {
					if(Game_Status == "HomeScene"){
						try{
							scene.remove(StartGameMesh);	
							scene.remove(AboutMesh);	
							scene.remove(HowToPlayMesh);	
							scene.remove(CreditsMesh);	
							console.log("StartGame was Hit!!!!")
							load_Board();
							Dom.emit('Start Count to the Next Game');
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(StartGameMesh);
			
			
			//About Button
			var T = loader.load( 'Pictures/About2.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			AboutMesh = new THREE.Sprite(T1);
			scene.add(AboutMesh);
			AboutMesh.position.set(0,-2.5,35);
			AboutMesh.scale.set(8,1.5,1);
			//Function
			AboutMesh.callback = function() {
					if(Game_Status == "HomeScene"){
						try{
							alert("About not set up as of yet");
							AboutMesh.parameters.fillStyle= "Crimson";
							AboutMesh.update();
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(AboutMesh);
			
			/**
			
			
			//How To Play Button
			var T = loader.load( 'Pictures/StartGame.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			StartGameMesh = new THREE.Sprite(T1);
			scene.add(HowToPlayMesh);
			HowToPlayMesh.position.set(0,-0.5,35);
			HowToPlayMesh.scale.set(11,2,1);
			//Function
			HowToPlayMesh.callback = function() {
					if(Game_Status == "HomeScene"){
						try{
							//alert("How to Play not set up as of yet");
							scene.remove(StartGameMesh);	
							scene.remove(AboutMesh);	
							scene.remove(HowToPlayMesh);	
							scene.remove(CreditsMesh);	
							load_Board();
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(HowToPlayMesh);
			**/
			
			//Credits Button
			var T = loader.load( 'Pictures/Credits.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			CreditsMesh = new THREE.Sprite(T1);
			scene.add(CreditsMesh);
			CreditsMesh.position.set(0,-4.5,35);
			CreditsMesh.scale.set(8,1.5,1);
			//Function
			CreditsMesh.callback = function() {
					if(Game_Status == "HomeScene"){
						try{
							scene.remove(StartGameMesh);	
							scene.remove(AboutMesh);	
							scene.remove(HowToPlayMesh);	
							scene.remove(CreditsMesh);	
							Game_Status == "Game Over"
							load_Board();
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(CreditsMesh);
			
			//Source
			//view-source:https://threejs.org/examples/canvas_interactive_cubes.html
			/**
			text = "Start Game";
			var Start_Game_Texture  = new THREEx.DynamicTexture(1024,256)
			Start_Game_Texture.context.font	= "bolder 150px Verdana";
			//Start_Game_Texture.clear('MediumSlateBlue').drawText(text, 12, 206, 'Lime');
			Start_Game_Texture.clear('MediumSlateBlue').drawText(text, 12, 206, 'Lime');
			//Adding Texture to the Scene
			var geometry = new THREE.PlaneGeometry( 14, 2, 1);
			var material = new THREE.MeshBasicMaterial({
				map	: Start_Game_Texture.texture
			});
			StartGameMesh = new THREE.Mesh( geometry, material );
			StartGameMesh.position.set(1,0.75,35);
			scene.add( StartGameMesh );
			console.log(StartGameMesh);
			StartGameMesh.callback = function() {
					if(Game_Status == "HomeScene"){
						try{
							console.log("Start Button Pressed");
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(StartGameMesh);
			**/
			
		}

		function load_infoBackscene(){
			var planeGeometry = new THREE.PlaneBufferGeometry (15, 7.25,0);
			var planeMaterial = new THREE.MeshBasicMaterial({color: 0x1e0c4c}); //RGB	
			infoBackscene = new THREE.Mesh(planeGeometry, planeMaterial);
			infoBackscene.material.transparent = true;
			//infoBackscene.material.depthWrite = false;
			infoBackscene.material.opacity = 0.4;
			infoBackscene.position.set(0,-1.25,37); //xyz
			scene.add(infoBackscene);
		}
		
		function load_HowToPlay(){
			load_infoBackscene();
			var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
			var HTP01 = loader.load( 'Pictures/HowToPlay1.png' );
				HTP01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (4, 1,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: HTP01, color: 0xffffff } );
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x2ff33c}); //RGB	
			Slides = new THREE.Mesh(planeGeometry, planeMaterial);
			scene.add(Slides);
			Slides.position.set(0,-2,38); 
			Slides.scale.set(3,3,1); 
		}
		
		function load_About(){
			load_infoBackscene();
			var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
			var HTP01 = loader.load( 'Pictures/HowToPlay1.png' );
				HTP01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (4, 1,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: HTP01, color: 0xffffff } );
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x2ff33c}); //RGB	
			Slides = new THREE.Mesh(planeGeometry, planeMaterial);
			scene.add(Slides);
			Slides.position.set(0,-2,38); 
			Slides.scale.set(3,3,1); 
		}
		
		// Socket Functions
		// Request is sent to receive a hand in dominoes
		function requestDominoes() {
			Dom.emit('Dominoes Requests');
		}
		
		//Print List of Players
		function Print() {
			Dom.emit('Print List of Players');
		}
		
		function reshuffleDominoes() {
			Dom.emit('Shuffle Dominoes Requests');
		}
		
		function playDomino(dominoNumber,side,hand) {
			var data = {
				dominoNumber:dominoNumber,
				preferred_side:side,
				player:player,
				count: sum,
				handSize:hand
			};
			// Send that object to the socket
			Dom.emit('played_Domino',data);
			PlayerNotification.parameters.text= "You are Player "+player;
			PlayerNotification.update();
		}
}
	//window.onload = init;	
	window.onload = setup;	