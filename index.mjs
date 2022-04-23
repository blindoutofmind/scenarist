const Scenarist = Object .defineProperty ( function Scenarist ( setting ) {

return new this ( setting );

} .bind ( ( () => {

const $ = {};

for ( const signature of [

'setting',
'scenario',
'proxy',
'construct',
'defineProperty',
'deleteProperty',
'get',
'getOwnPropertyDescriptor',
'getPrototypeOf',
'has',
'isExtensible',
'ownKeys',
'preventExtensions',
'set',
'setPrototypeOf'

] )
$ [ signature ] = Symbol ( signature );

const Story = function Story ( setting ) {

const story = this;

story [ $ .scenario ] = Object .defineProperty (

Scenario .bind ( story ),
'name', { value: 'scenario', configurable: true }

);
story [ $ .setting ] = setting;
story [ $ .proxy ] = new Proxy ( story [ $ .scenario ], Director );

if ( ! Object .isExtensible ( setting ) )
Object .preventExtensions ( story [ $ .scenario ] );

return story [ $ .proxy ];

};

Object .defineProperty ( Story .prototype, 'constructor', { value: Story } );

const Scenario = function Scenario ( ... order ) {

const story = this;
const setting = story [ $ .setting ];
const [ direction ] = order;

if ( Story .prototype [ direction ] )
return story [ order .shift () ] ( order );

if ( typeof setting === 'function' )
return setting ( ... order );

const conflict = story [ $ .get ] ( order );

return typeof conflict === 'function' ? conflict ( ... order ) : conflict;

};

const script = {};

script .construct = function construct ( order ) {

return new this [ $ .setting ] ( ... order );

};

script .defineProperty = function defineProperty ( [ direction, details ] ) {

const story = this;

Object .defineProperty ( story [ $ .setting ], direction, details );

return story [ $ .proxy ];

};

script .deleteProperty = function deleteProperty ( [ direction ] ) {

return delete this [ $ .setting ] [ direction ];

};

script .get = function get ( order ) {

const story = this;
const setting = story [ $ .setting ];
const [ direction ] = order;
let conflict = setting [ direction ];

switch ( typeof conflict ) {

case 'object':
case 'function':

conflict = story [ conflict ] = story [ conflict ] || new Story (

typeof conflict === 'function' ? conflict .bind ( setting ) : conflict

);

order .shift ();

}

return conflict;

};

script .getOwnPropertyDescriptor = function getOwnPropertyDescriptor ( [ direction ] ) {

const settingDescriptor = Object .getOwnPropertyDescriptor ( this [ $ .setting ], direction );
const scenarioDescriptor = Object .getOwnPropertyDescriptor ( this [ $ .scenario ], direction );

//if ( settingDescriptor ?.configurable !== scenarioDescriptor ?.configurable )
Object .defineProperty ( this [ $ .scenario ], direction, settingDescriptor );

return settingDescriptor;

};

script .getPrototypeOf = function getPrototypeOf () {

return Object .getPrototypeOf ( this [ $ .setting ] );

};

script .has = function has ( [ direction ] ) {

return Reflect .has ( this [ $ .setting ], direction );

};

script .isExtensible = function isExtensible () {

return Object .isExtensible ( this [ $ .setting ] );

};

script .ownKeys = function ownKeys () {

return Reflect .ownKeys ( this [ $ .setting ] );

};

script .preventExtensions = function preventExtensions () {

Object .preventExtensions ( this [ $ .setting ] );
Object .preventExtensions ( this [ $ .scenario ] );

return this [ $ .proxy ];

};

script .set = function set ( order ) {

const story = this;
const [ direction, details ] = order;

story [ $ .setting ] [ direction ] = details;

return story [ $ .get ] ( order );

};

script .setPrototypeOf = function setPrototypeOf ( [ prologue ] ) {

Object .setPrototypeOf ( this [ $ .setting ], prologue );

return this [ $ .proxy ];

};

for ( const action in script )
Object .defineProperty ( Story .prototype, $ [ action ], {

value: script [ action ]

} );

const Director = {

construct: ( scenario, order ) => scenario ( $ .construct, ... order ),
defineProperty: ( scenario, direction, details ) => scenario ( $ .defineProperty, direction, details ),
deleteProperty: ( scenario, direction ) => scenario ( $ .deleteProperty, direction ),
get: ( scenario, direction ) => scenario ( $ .get, direction ),
getOwnPropertyDescriptor: ( scenario, direction ) => scenario ( $ .getOwnPropertyDescriptor, direction ),
getPrototypeOf: scenario => scenario ( $ .getPrototypeOf ),
has: ( scenario, direction ) => scenario ( $ .has, direction ),
isExtensible: scenario => scenario ( $ .isExtensible ),
ownKeys: scenario => scenario ( $ .ownKeys ),
preventExtensions: scenario => scenario ( $ .preventExtensions ),
set: ( scenario, direction, details ) => scenario ( $ .set, direction, details ),
setPrototypeOf: ( scenario, prologue ) => scenario ( $ .setPrototypeOf, prologue )

};

return Story;

} ) () ), 'name', { value: 'Scenarist' } );

export default Scenarist;
