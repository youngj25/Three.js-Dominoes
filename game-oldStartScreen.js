var socket;
var player;
var Game_Status,camera;
var objects = [], board = [], dominoes= [];
var refresh_time = 0,wait=0, backgroundDisplay = 0;
var numberOfDominoes=28; //The number of dominoes in the game
var placeHolderHeight = -4.95;
var leftValue = -1,rightValue =-1, CenterPiece;
var Dominoe1, Dominoe2, Dominoe3, Dominoe4, Dominoe5, Dominoe6, Dominoe7;
var DominoesAmount = 28; //set to 14 so I can get easier combos... Originally 28
//Board Design
var Board, placeHolder;
var Wood,Tile;
//Start Game
var startDominoes1,startDominoes2,startDominoes3,startDominoes4, r=0, Start,Title1;
var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster(), pos = new THREE.Vector3();
//Sub-Game
var removed = 0, points = 168;
//Game info Backscene
var infoBackscene;
//How To Play Slides
var Slides;



function setup() {
			// create a scene, that will hold all our elements such as objects, cameras and lights.
			var scene = new THREE.Scene();				
			
			// create a camera, which defines where we're looking at.
			camera = new THREE.PerspectiveCamera(45, 800/ 500, 0.1, 1000);
			camera.position.set(0,0,50);
			scene.add(camera);
	
			// create a render and set the size
			var renderer = new THREE.WebGLRenderer({ antialias: true} );
			renderer.setClearColor(new THREE.Color(0x000000, 0.0));
			//set the size
			renderer.setSize(600, 750);
			//renderer.shadowMapEnabled = true	
			
			//Later change this back to false
			var endGame = true; //The Game is over and you'll have to restart
			
			
			var controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3; 
				
		//Sockets
			socket = io.connect('http://localhost:9000');
			//socket = io.connect('ec2-54-84-203-78.compute-1.amazonaws.com:9000');
		
		
		
		
		socket.on('Domino Played',
			// When we receive data
			function(data) {
			  console.log("Got: [ | ]");
			}
		  );
		
		//Add_Domino_to_Board
		socket.on('Add_Domino_to_Board',
			// When we receive data
			function(data) {
			  //console.log("Add ["+data.topNumber+"|"+data.bottomNumber+"] ("+data.dominoNumber+") to board");
			  addToBoardfromServer(data.dominoNumber);
			}
		  );
		  
		socket.on('Hand',
			// When we receive data
			function(hand) {
			  console.log("Domino 1: " + hand.one + " -> [" + dominoes[hand.one].TopNumber+"|"+dominoes[hand.one].BottomNumber+"]");
			  console.log("Domino 2: " + hand.two + " -> [" + dominoes[hand.two].TopNumber+"|"+dominoes[hand.two].BottomNumber+"]");
			  console.log("Domino 3: " + hand.three + " -> [" + dominoes[hand.three].TopNumber+"|"+dominoes[hand.three].BottomNumber+"]");
			  console.log("Domino 4: " + hand.four + " -> [" + dominoes[hand.four].TopNumber+"|"+dominoes[hand.four].BottomNumber+"]");
			  console.log("Domino 5: " + hand.five + " -> [" + dominoes[hand.five].TopNumber+"|"+dominoes[hand.five].BottomNumber+"]");
			  console.log("Domino 6: " + hand.six + " -> [" + dominoes[hand.six].TopNumber+"|"+dominoes[hand.six].BottomNumber+"]");
			  console.log("Domino 7: " + hand.seven + " -> [" + dominoes[hand.seven].TopNumber+"|"+dominoes[hand.seven].BottomNumber+"]");
				
				var space = 2.55;
				
				Dominoe1 =  new THREE.Sprite();
				scene.add( Dominoe1 );
				objects.push(Dominoe1);
				Dominoe1.material=dominoes[hand.one].Sprite;
				Dominoe1.material.name=hand.one;
				Dominoe1.material.rotation=Math.PI/2;
				Dominoe1.scale.set(1.75,1.75,1);
				Dominoe1.position.set( -7.75,placeHolderHeight,35 );

				Dominoe2 =  new THREE.Sprite();
				scene.add( Dominoe2 );
				objects.push(Dominoe2);
				Dominoe2.material=dominoes[hand.two].Sprite;
				Dominoe2.material.name=hand.two;
				Dominoe2.material.rotation=Math.PI/2;
				Dominoe2.scale.set(1.75,1.75,1);
				Dominoe2.position.set( -7.75 +space*1,placeHolderHeight,35 );
				
				Dominoe3 =  new THREE.Sprite();
				scene.add( Dominoe3 );
				objects.push(Dominoe3);
				Dominoe3.material=dominoes[hand.three].Sprite;
				Dominoe3.material.name=hand.three;
				Dominoe3.material.rotation=Math.PI/2;
				Dominoe3.scale.set(1.75,1.75,1);
				Dominoe3.position.set( -7.75 +space*2,placeHolderHeight,35 );
				
				Dominoe4 =  new THREE.Sprite();
				scene.add( Dominoe4 );
				objects.push(Dominoe4);
				Dominoe4.material=dominoes[hand.four].Sprite;
				Dominoe4.material.name=hand.four;
				Dominoe4.material.rotation=Math.PI/2;
				Dominoe4.scale.set(1.75,1.75,1);
				Dominoe4.position.set( -7.75 +space*3,placeHolderHeight,35 );
				
				Dominoe5 =  new THREE.Sprite();
				scene.add( Dominoe5 );
				objects.push(Dominoe5);
				Dominoe5.material=dominoes[hand.five].Sprite;
				Dominoe5.material.name=hand.five;
				Dominoe5.material.rotation=Math.PI/2;
				Dominoe5.scale.set(1.75,1.75,1);
				Dominoe5.position.set( -7.75 +space*4,placeHolderHeight,35 );
				
				Dominoe6 =  new THREE.Sprite();
				scene.add( Dominoe6 );
				objects.push(Dominoe6);
				Dominoe6.material=dominoes[hand.six].Sprite;
				Dominoe6.material.name=hand.six;
				Dominoe6.material.rotation=Math.PI/2;
				Dominoe6.scale.set(1.75,1.75,1);
				Dominoe6.position.set( -7.75 +space*5,placeHolderHeight,35 );
				
				Dominoe7 =  new THREE.Sprite();
				scene.add( Dominoe7 );
				objects.push(Dominoe7);
				Dominoe7.material=dominoes[hand.seven].Sprite;
				Dominoe7.material.name=hand.seven;
				Dominoe7.material.rotation=Math.PI/2;
				Dominoe7.scale.set(1.75,1.75,1);
				Dominoe7.position.set( -7.75 +space*6,placeHolderHeight,35 );
			}
		  );
		//Audio
			/* var wingFlap = new Audio('FlapPyBird-master/assets/audio/wing.ogg');
			wingFlap.volume=0.1;
			*/
		

		//Keyboard Functions
		var onKeyDown = function(event) {
			//Space Bar Changes Background
			if (event.keyCode == 32 && wait < step && Game_Status == "Ready") { 
					//Load Random Dominoes
					backgroundDisplay = (backgroundDisplay + 1) % 3;
					
					if(backgroundDisplay == 0)
						Board.material = new THREE.MeshLambertMaterial({color: 0x224522})
					else if(backgroundDisplay == 1)
						Board.material = new THREE.MeshBasicMaterial( { map: Wood, color: 0xffffff } );
					else if(backgroundDisplay == 2)
						Board.material = new THREE.MeshBasicMaterial( { map: Tile, color: 0xffffff } );
					
					console.log("changed");			
			}
			else if (event.keyCode == 13 && wait < step && Game_Status == "Ready") { // Enter 
					sendDomino();
					wait = step + 3;		
			}
		}; 
		
		document.addEventListener('keydown', onKeyDown, false);	
		
		var StartGame = document.getElementById("StartGame");
		StartGame.onclick = function(event) {
			//alert ("moot!");
			document.getElementById("StartGame").innerHTML = "";	
			document.getElementById("About").innerHTML = "";	
			document.getElementById("HowToPlay").innerHTML = "";	
			document.getElementById("Credits").innerHTML = "";	
			document.getElementById("Exit").innerHTML = "";	
			console.log("StartGame was Hit!!!!")
			load_Board();
			};
			
		var HowToPlay = document.getElementById("HowToPlay");
		HowToPlay.onclick = function(event) {
			document.getElementById("StartGame").innerHTML = "";	
			document.getElementById("About").innerHTML = "";	
			document.getElementById("HowToPlay").innerHTML = "";	
			document.getElementById("Credits").innerHTML = "";	
			document.getElementById("Exit").innerHTML = "X";
			load_HowToPlay();
			console.log("HowToPlay was Hit!!!!")
			};
			
		var About = document.getElementById("About");
		About.onclick = function(event) {
			document.getElementById("StartGame").innerHTML = "";	
			document.getElementById("About").innerHTML = "";	
			document.getElementById("HowToPlay").innerHTML = "";	
			document.getElementById("Credits").innerHTML = "";	
			document.getElementById("Exit").innerHTML = "X";
			load_About();
			console.log("About was Hit!!!!")
			};
		
		var Credits = document.getElementById("Credits");
		Credits.onclick = function(event) {
			document.getElementById("StartGame").innerHTML = "";	
			document.getElementById("About").innerHTML = "";	
			document.getElementById("HowToPlay").innerHTML = "";	
			document.getElementById("Credits").innerHTML = "";	
			document.getElementById("Exit").innerHTML = "X";
			//load_Credits();
			console.log("Credits was Hit!!!!")
			};
			
		var Exit = document.getElementById("Exit");
		Exit.onclick = function(event) {
			document.getElementById("StartGame").innerHTML = "Start Game";	
			document.getElementById("About").innerHTML = "About";	
			document.getElementById("HowToPlay").innerHTML = "How To Play";	
			document.getElementById("Credits").innerHTML = "Credits";
			document.getElementById("Exit").innerHTML = "";
			scene.remove(infoBackscene);
			scene.remove(Slides);
			};
		//source developers.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick
		
		
		renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
		//document.addEventListener('mousedown', onDocumentMouseDown, false)
		//window.addEventListener('mousedown', onDocumentMouseDown, false)
		//https://forums.khronos.org/showthread.php/8407-add-event-listener-in-webgl-designed-object
		
		//renderer.domElement.addEventListener('click', console.log(":D"), false)
		//renderer.getElementById("startDominoes1").addEventListener("click", console.log(":D"));
		
		function onDocumentMouseDown (event){
			//console.log("yes");
			if(Game_Status == "StartScreen"){
				//load_Board();
				load_HomeScene();
				console.log("Loaded!!!!");
				document.getElementById("StartGame").innerHTML = "Start Game";	
				document.getElementById("About").innerHTML = "About";	
				document.getElementById("HowToPlay").innerHTML = "How To Play";	
				document.getElementById("Credits").innerHTML = "Credits";
			}	
				event.preventDefault();
				
				mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
				mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
				
				//raycaster.setFromCamera( mouse, camera );
				//pos.copy(raycaster.ray.origin);
				//pos.add(raycaster.ray.origin);
				//console.log("x:"+pos.x+" y:"+pos.y);
				
				//view-source:file:///F:/temp/web2/public/three.js-master/examples/webgl_physics_volume.html
				//console.log("x:" + event.clientX );
				//console.log("X:" +  mouse.x);
				//console.log("X':" + startDominoes2.alphaTest );
				//console.log("wind:" +  window.innerWidth);
				//console.log("y:" + event.clientY );
				//console.log("Y:" + mouse.y);
				//console.log("Y':" +  ( event.clientY / window.innerHeight  ) * 2 - 1);
				//console.log("x-"+event.clientX);
				//console.log("X-"+event.screenX);
				//console.log("y-"+event.clientY);
				//console.log("Y-"+event.screenY);
			//https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
		}
		
        //add spotlight for the shadows
			var spotLight = new THREE.SpotLight(0xffffff);
			spotLight.position.set(0, 50, 150);
			spotLight.castShadow = false;
			spotLight.intensity =2;
			scene.add(spotLight);

		var controls = new function () {
            this.Cube_Speed = 0.04;
            this.Sphere_Speed = 0.04;
        };
		
		//var gui = new dat.GUI();		
		//http://learningthreejs.com/blog/2011/08/14/dat-gui-simple-ui-for-demos/
        //gui.add(controls, 'Cube_Speed', 0.02, 0.2);
		// gui.add(controls, 'Sphere_Speed', 0.02, 0.2);
		
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
			load_StartScene();
			renderScene();
			//shuffle();
			drag_objects();
			//load_Board();

			function renderScene(){
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
							else if (e.position.y >= (placeHolderHeight+1.5) && dominoes[e.material.name].Status != "board"){
								e.material.color.setHex(0xaaffff);
								//e.scale.set(,2.8,1);
								//addToBoard(e);
								playDomino(e.material.name);
								//addToBoardfromServer(e.material.name);
								scene.remove(e);
							}							
						}
						//else if(e == startDominoes1 || e == startDominoes2 || e == startDominoes3){
						else if(e == startDominoes1 || e == startDominoes2 || e == startDominoes3||
								e == startDominoes4){
							
							//Wall Limits
							var LeftWall = -10;
							var TopWall = 10;
							var BottomWall = -10;
							var RightWall = 10;
							
							//var x = e.position.x;
							//var y = e.position.y;
							//var z = e.position.z;
							//e.position.set(0,0,0);
							//e.rotation.z = (e.rotation.z+0.01)%(Math.PI*2);
							//e.position.set(x,y,z);
							
							/**
							if(e.fog == true){
								e.position.x += 0.03;                
							}
							else{
								e.position.x -= 0.03;
							}
							**/
							e.position.y -= 0.05;
							if(e.position.x < LeftWall || e.position.x > RightWall){
								e.fog=!e.fog;
							}
							else if(e.position.y < (BottomWall-2)){
								e.position.y = Math.floor(Math.random()*4)+10;
								e.position.x = Math.floor(Math.random()*18)-9;
							}
							
						}
						else if(e == Title1 && Game_Status == "HomeScene" && e.position.y < 4){
							e.position.y+=0.15;
						}
					});					
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
																				});
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
			
			function addToBoardfromServer(dominoNumber){
				
				//Control Variables to Change the Scaling
				var sidewaysX = 2.8;
				var sidewaysY = 0.6;
				var straightX = 1.1;
				var straightY = 1.3;
				
				//New Positions Variables
				var xPos = 0;
				var yPos = 1;
				
				//Wall Limits
				var LeftWall = -5.5;
				var TopWall = 4;
				var BottomWall = -2;
				var RightWall = 5;
				
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
					board.unshift(Spir);
					board[0].xPos = xPos;
					board[0].yPos = yPos;
						
					
					//If the first domino is a double
					if(dominoes[dominoNumber].TopNumber == dominoes[dominoNumber].BottomNumber){
						console.log("Double");
						Spir.scale.set(straightX,straightY,1);
						//board[0].Position = "straight up";
					}
					//Otherwise if the first domino is not a double
					else{						
						Spir.material.rotation=0/2;
						Spir.material.name=dominoNumber;
						Spir.scale.set(sidewaysX,sidewaysY,1);
						board[0].Position = "side way";
						console.log("-Not a double");						
					}						
					CenterPiece=0;
					Spir.xPos = xPos;
					Spir.yPos = yPos;
					board.unshift(Spir);
				}				
				
				//LEFT HAND SIDE
				//Adding the domino to the left hand side of the board
				else if(leftValue == dominoes[dominoNumber].TopNumber ||
						leftValue == dominoes[dominoNumber].BottomNumber){
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
				}
				
				//Right Hand Side
				else if(rightValue == dominoes[dominoNumber].TopNumber ||
						rightValue == dominoes[dominoNumber].BottomNumber){
					dominoes[dominoNumber].Status = "board";
					
					console.log("R");
					
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
					
						//Color for the Center Domino Piece
						if( x == CenterPiece)//RGB
							board[x].material.color.setHex(0xA9FA66);							
						//Color for Doubles
						else if(dominoes[board[x].material.name].BottomNumber == dominoes[board[x].material.name].TopNumber)
							board[x].material.color.setHex(0x88E0F9); //RGB
						else
							board[x].material.color.setHex(0xffffff); //RGB
						
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
					var D = {TopNumber:0, BottomNumber:0, Status: "available", Sprite: Sprite00, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//01
					var Texture01 = loader.load( 'Pictures/01.png' );
					Texture01.minFilter = THREE.LinearFilter;
					var Sprite01 =  new THREE.SpriteMaterial( { map: Texture01, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:1, Status: "available", Sprite: Sprite01, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//02
					var Texture02 = loader.load( 'Pictures/02.png' );
					Texture02.minFilter = THREE.LinearFilter;
					var Sprite02 =  new THREE.SpriteMaterial( { map: Texture02, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:2, Status: "available", Sprite: Sprite02, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//03
					var Texture03 = loader.load( 'Pictures/03.png' );
					Texture03.minFilter = THREE.LinearFilter;
					var Sprite03 =  new THREE.SpriteMaterial( { map: Texture03, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:3, Status: "available", Sprite: Sprite03, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//04
					var Texture04 = loader.load( 'Pictures/04.png' );
					Texture04.minFilter = THREE.LinearFilter;
					var Sprite04 =  new THREE.SpriteMaterial( { map: Texture04, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:4, Status: "available", Sprite: Sprite04, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//05
					var Texture05 = loader.load( 'Pictures/05.png' );
					Texture05.minFilter = THREE.LinearFilter;
					var Sprite05 =  new THREE.SpriteMaterial( { map: Texture05, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:5, Status: "available", Sprite: Sprite05, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//06
					var Texture06 = loader.load( 'Pictures/06.png' );
					Texture06.minFilter = THREE.LinearFilter;
					var Sprite06 =  new THREE.SpriteMaterial( { map: Texture06, color: 0xffffff } );
					var D = {TopNumber:0, BottomNumber:6, Status: "available", Sprite: Sprite06, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//11
					var Texture11 = loader.load( 'Pictures/11.png' );
					Texture11.minFilter = THREE.LinearFilter;
					var Sprite11 =  new THREE.SpriteMaterial( { map: Texture11, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:1, Status: "available", Sprite: Sprite11, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//12
					var Texture12 = loader.load( 'Pictures/12.png' );
					Texture12.minFilter = THREE.LinearFilter;
					var Sprite12 =  new THREE.SpriteMaterial( { map: Texture12, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:2, Status: "available", Sprite: Sprite12, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//13
					var Texture13 = loader.load( 'Pictures/13.png' );
					Texture13.minFilter = THREE.LinearFilter;
					var Sprite13 =  new THREE.SpriteMaterial( { map: Texture13, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:3, Status: "available", Sprite: Sprite13, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//14
					var Texture14 = loader.load( 'Pictures/14.png' );
					Texture14.minFilter = THREE.LinearFilter;
					var Sprite14 =  new THREE.SpriteMaterial( { map: Texture14, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:4, Status: "available", Sprite: Sprite14, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//15
					var Texture15 = loader.load( 'Pictures/15.png' );
					Texture15.minFilter = THREE.LinearFilter;
					var Sprite15 =  new THREE.SpriteMaterial( { map: Texture15, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:5, Status: "available", Sprite: Sprite15, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//16
					var Texture16 = loader.load( 'Pictures/16.png' );
					Texture16.minFilter = THREE.LinearFilter;
					var Sprite16 =  new THREE.SpriteMaterial( { map: Texture16, color: 0xffffff } );
					var D = {TopNumber:1, BottomNumber:6, Status: "available", Sprite: Sprite16, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//22
					var Texture22 = loader.load( 'Pictures/22.png' );
					Texture22.minFilter = THREE.LinearFilter;
					var Sprite22 =  new THREE.SpriteMaterial( { map: Texture22, color: 0xffffff } );
					var D = {TopNumber:2, BottomNumber:2, Status: "available", Sprite: Sprite22, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//23
					var Texture23 = loader.load( 'Pictures/23.png' );
					Texture23.minFilter = THREE.LinearFilter;
					var Sprite23 =  new THREE.SpriteMaterial( { map: Texture23, color: 0xffffff } );
					var D = {TopNumber:2, BottomNumber:3, Status: "available", Sprite: Sprite23, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//24
					var Texture24 = loader.load( 'Pictures/24.png' );
					Texture24.minFilter = THREE.LinearFilter;
					var Sprite24 =  new THREE.SpriteMaterial( { map: Texture24, color: 0xffffff } );
					var D = {TopNumber:2, BottomNumber:4, Status: "available", Sprite: Sprite24, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//25
					var Texture25 = loader.load( 'Pictures/25.png' );
					Texture25.minFilter = THREE.LinearFilter;
					var Sprite25 =  new THREE.SpriteMaterial( { map: Texture25, color: 0xffffff } );
					var D = {TopNumber:2, BottomNumber:5, Status: "available", Sprite: Sprite25, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//26
					var Texture26 = loader.load( 'Pictures/26.png' );
					Texture26.minFilter = THREE.LinearFilter;
					var Sprite26 =  new THREE.SpriteMaterial( { map: Texture26, color: 0xffffff } );
					var D = {TopNumber:2, BottomNumber:6, Status: "available", Sprite: Sprite26, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//33
					var Texture33 = loader.load( 'Pictures/33.png' );
					Texture33.minFilter = THREE.LinearFilter;
					var Sprite33 =  new THREE.SpriteMaterial( { map: Texture33, color: 0xffffff } );
					var D = {TopNumber:3, BottomNumber:3, Status: "available", Sprite: Sprite33, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//34
					var Texture34 = loader.load( 'Pictures/34.png' );
					Texture34.minFilter = THREE.LinearFilter;
					var Sprite34 =  new THREE.SpriteMaterial( { map: Texture34, color: 0xffffff } );
					var D = {TopNumber:3, BottomNumber:4, Status: "available", Sprite: Sprite34, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//35
					var Texture35 = loader.load( 'Pictures/35.png' );
					Texture35.minFilter = THREE.LinearFilter;
					var Sprite35 =  new THREE.SpriteMaterial( { map: Texture35, color: 0xffffff } );
					var D = {TopNumber:3, BottomNumber:5, Status: "available", Sprite: Sprite35, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//36
					var Texture36 = loader.load( 'Pictures/36.png' );
					Texture36.minFilter = THREE.LinearFilter;
					var Sprite36 =  new THREE.SpriteMaterial( { map: Texture36, color: 0xffffff } );
					var D = {TopNumber:3, BottomNumber:6, Status: "available", Sprite: Sprite36, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//44
					var Texture44 = loader.load( 'Pictures/44.png' );
					Texture44.minFilter = THREE.LinearFilter;
					var Sprite44 =  new THREE.SpriteMaterial( { map: Texture44, color: 0xffffff } );
					var D = {TopNumber:4, BottomNumber:4, Status: "available", Sprite: Sprite44, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//45
					var Texture45 = loader.load( 'Pictures/45.png' );
					Texture45.minFilter = THREE.LinearFilter;
					var Sprite45 =  new THREE.SpriteMaterial( { map: Texture45, color: 0xffffff } );
					var D = {TopNumber:4, BottomNumber:5, Status: "available", Sprite: Sprite45, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//46
					var Texture46 = loader.load( 'Pictures/46.png' );
					Texture46.minFilter = THREE.LinearFilter;
					var Sprite46 =  new THREE.SpriteMaterial( { map: Texture46, color: 0xffffff } );
					var D = {TopNumber:4, BottomNumber:6, Status: "available", Sprite: Sprite46, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//55
					var Texture55 = loader.load( 'Pictures/55.png' );
					Texture55.minFilter = THREE.LinearFilter;
					var Sprite55 =  new THREE.SpriteMaterial( { map: Texture55, color: 0xffffff } );
					var D = {TopNumber:5, BottomNumber:5, Status: "available", Sprite: Sprite55, xPos:0, yPos:0, Position:"straight up"}
					dominoes.push(D);
					//56
					var Texture56 = loader.load( 'Pictures/56.png' );
					Texture56.minFilter = THREE.LinearFilter;
					var Sprite56 =  new THREE.SpriteMaterial( { map: Texture56, color: 0xffffff } );
					var D = {TopNumber:5, BottomNumber:6, Status: "available", Sprite: Sprite56, xPos:0, yPos:0, Position:"side way"}
					dominoes.push(D);
					//66
					var Texture66 = loader.load( 'Pictures/66.png' );
					Texture66.minFilter = THREE.LinearFilter;
					var Sprite66 =  new THREE.SpriteMaterial( { map: Texture66, color: 0xffffff } );		
					var D = {TopNumber:6, BottomNumber:6, Status: "available", Sprite: Sprite66, xPos:0, yPos:0, Position:"straight up"}
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
					
					var planeGeometry = new THREE.PlaneBufferGeometry (25, 11.5,0);
					var planeMaterial = new THREE.MeshLambertMaterial({color: 0x224522}); //RGB		
					//var planeMaterial =  new THREE.MeshBasicMaterial( { map: Texture, color: 0xffffff } );
					Board = new THREE.Mesh(planeGeometry, planeMaterial);
					Board.position.set(0,1.15,30); //xyz
					scene.add(Board);			
					
					//Dominoes PlaceHolder
					planeGeometry = new THREE.PlaneBufferGeometry (18.5, 2.15,0);
					planeMaterial = new THREE.MeshLambertMaterial({color: 0x000030}); //RGB		
					placeHolder = new THREE.Mesh(planeGeometry, planeMaterial);
					placeHolder.position.set(0, placeHolderHeight,35); //xyz
					scene.add(placeHolder);
				
			}
			
			function load_StartScene(){
				var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
				
				var planeGeometry = new THREE.PlaneBufferGeometry (25, 16,0);
				var planeMaterial = new THREE.MeshLambertMaterial({color: 0x2e1b7c}); //RGB		
				
				Start = new THREE.Mesh(planeGeometry, planeMaterial);
				Start.position.set(0,0,30); //xyz
				scene.add(Start);
				
				var T = loader.load( 'Pictures/Title_1.png' );
				T.minFilter = THREE.LinearFilter;
				var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
				Title1 = new THREE.Sprite(T1);				
				
				scene.add(Title1);
				Title1.position.set(0,0,35); 
				Title1.scale.set(17,3,1);
				
				var d01 = loader.load( 'Pictures/45.png' );
				d01.minFilter = THREE.LinearFilter;
				planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
				planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
				startDominoes1 = new THREE.Mesh(planeGeometry, planeMaterial);
				scene.add(startDominoes1);
				startDominoes1.rotation.z = Math.PI/2;
				startDominoes1.position.set(-2,-3,30); 
				startDominoes1.fog=false;
				
				
				startDominoes2 = new THREE.Sprite(dominoes[Math.floor(Math.random()*4)+4].Sprite);
				scene.add(startDominoes2);
				startDominoes2.position.set(7,8,30); 
				startDominoes2.material.rotation = Math.PI/2;
				startDominoes2.scale.set(2.25,2.25,1);
				startDominoes2.fog=false;
				
				var d01 = loader.load( 'Pictures/01.png' );
				d01.minFilter = THREE.LinearFilter;
				planeGeometry = new THREE.PlaneBufferGeometry (2.25, 2.25,0);
				planeMaterial = new THREE.MeshBasicMaterial( { map: d01, color: 0xffffff } );
				startDominoes3 = new THREE.Mesh(planeGeometry, planeMaterial);
				scene.add(startDominoes3);
				startDominoes3.position.set(-5,3,30); 
				startDominoes3.rotation.z = Math.PI/2;
				startDominoes3.fog=false;
				
				startDominoes4 = new THREE.Sprite(dominoes[Math.floor(Math.random()*4)+12].Sprite);
				scene.add(startDominoes4);
				startDominoes4.position.set(5,2,30);
				//startDominoes4.scale.set(4.5,1.15,1);
				startDominoes4.material.rotation = Math.PI/2;
				startDominoes4.scale.set(2.25,2.25,1);
				startDominoes4.fog=false;
				
				Game_Status = "StartScreen";
				//http://flamingtext.com/
			}
			
			function load_HomeScene(){
				Game_Status = "HomeScene";
				
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
			//function sendmouse(xpos, ypos) {
			function sendDomino() {
				// We are sending!
				console.log("Send Domino: " + 0 + " " + 0);
				  
				// Make a little object with  and y
				var data = {
					x: 0,
					y: 0
				};

				// Send that object to the socket
				socket.emit('Send Domino',data);
			}
			
			function playDomino(dominoNumber) {
				var data = {
					dominoNumber:dominoNumber,
					preferred_side: ""
				};
				// Send that object to the socket
				socket.emit('played_Domino',data);
			}
}
		
	//window.onload = init;	
	window.onload = setup;	