const Scenarist = Object .defineProperty ( function Scenarist ( setting ) {

return new this ( setting );

} .bind ( ( () => {

const $ = {};

for ( const signature of [ 'setting', 'scenario', 'get', 'set' ] )
$ [ signature ] = Symbol ( signature );

const Story = function Story ( setting ) {

const story = this;
const scenario = Object .defineProperty (

Scenario .bind ( story ),
'name', { value: 'scenario', configurable: true }

);

story [ $ .setting ] = setting;
story [ $ .scenario ] = new Proxy ( scenario, Director );

return story [ $ .scenario ];

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

script .set = function set ( order ) {

const story = this;
const [ direction, details ] = order;

story [ $ .setting ] [ direction ] = details;

return story [ $ .get ] ( order );

};

for ( const action in script )
Object .defineProperty ( Story .prototype, $ [ action ], {

value: script [ action ]

} );

const Director = {

get: ( scenario, direction ) => scenario ( $ .get, direction ),
set: ( scenario, ... order ) => scenario ( $ .set, ... order )

};

return Story;

} ) () ), 'name', { value: 'Scenarist' } );

export default Scenarist;
