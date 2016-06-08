// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
	testAPI();

    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '136205566797085',
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
    });

    // Now that we've initialized the JavaScript SDK, we call
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/10152411439426287', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';

        updateDataAndDraw(response);

    });
}

function updateDataAndDraw(data) {
    create_or_update_tree(treeData);

    // Set username
    treeData.name = data.name;

    // Draw the tree
    create_or_update_tree(treeData);

    FB.api('/10152411439426287/picture', function(response){
        console.log('Successfully got picture');
        treeData.icon = response.data.url;
        create_or_update_tree(treeData);
    });

}

// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
width = 960 - margin.right - margin.left,
height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
	  "translate(" + margin.left + "," + margin.top + ")");

var treeData = {
    "name": "userName",
    "parent": "null",
    "value": 10,
    "type": "black",
    "level": "red",
    "icon": "default.png",
    "children": [
        {
            "name": "Level 2: A",
            "parent": "Top Level",
            "value": 5,
            "type": "grey",
            "level": "red",
            "icon": "cart.png",
            "children": [
                {
                    "name": "Son of A",
                    "parent": "Level 2: A",
                    "value": 5,
                    "type": "steelblue",
                    "icon": "lettern.png",
                    "level": "orange"
                },
                {
                    "name": "Daughter of A",
                    "parent": "Level 2: A",
                    "value": 18,
                    "type": "steelblue",
                    "icon": "vlc.png",
                    "level": "red"
                }
            ]
        },
        {
            "name": "Level 2: B",
            "parent": "Top Level",
            "value": 10,
            "type": "grey",
            "icon": "random.png",
            "level": "green"
        }
    ]
};

function create_or_update_tree(root) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
	.data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Remove any old stuff, when the function is called again.
    node.remove("g");

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
	.attr("class", "node")
	.attr("transform", function(d) {
	    return "translate(" + d.y + "," + d.x + ")"; });

    nodeEnter.append("image")
        .attr("xlink:href", function(d) { return d.icon; })
        .attr("x", "-12px")
        .attr("y", "-12px")
        .attr("width", "24px")
        .attr("height", "24px");

    nodeEnter.append("text")
	.attr("x", function(d) { return d.children || d.children ? (15) * -1 : + 15; })
	.attr("dy", ".35em")
	.attr("text-anchor", function(d) {
	    return d.children || d._children ? "end" : "start";
        })
	.text(function(d) { return d.name; })
	.style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
	.data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
	.attr("class", "link")
	.style("stroke", function(d) { return d.target.level; })
	.attr("d", diagonal);

}
