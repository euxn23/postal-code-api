var through  = require( 'through2' );
var csv = require( 'comma-separated-values' );

module.exports = function () {
  var transform = function( file, enc, callback ) {
    var content = file.contents.toString();

    var rows = new csv( content, {
      cast: [ 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String', 'String' ]
    } ).parse();

    var data = [];
    var n = {}
    for ( var i = 0; i < rows.length; i++ ) {
      var column = rows[i];

      var postal_data = {
        postal_code: column[2].trim(),
        prefecture: column[6].trim(),
        kanji: {
          addr1: column[7].replace( /　/g, '' ).trim(),
          addr2: column[8].replace( /（.*/, '' ).replace( /　/g, '' )
              .replace( /.*場合$/, "" ).replace( /.*一円$/, "" ).trim(),
          addr3: "",
          addr4: ""
        },
        kana: {
          pref: column[3].trim(),
          addr1: column[4].trim(),
          addr2: column[5].replace( /.*ﾊﾞｱｲ$/i, "" ).replace( /\(.*/, '' )
                  .replace( /.*ｲﾁｴﾝ$/i, "" )
                  .trim(),
          addr3: "",
          addr4: ""
        }
      };

      if ( ! n[JSON.stringify( postal_data )] ) {
        n[JSON.stringify( postal_data )] = true
        data.push( postal_data )
      }
    }

    file.contents = new Buffer( JSON.stringify( data ) );
    this.push( file );

    return callback();
  };

  return through.obj( transform );
};


String.prototype.capitalize = function(){
  var strs = this.toLowerCase().split( ' ' );
  for ( var i = 0; i < strs.length; i++ ) {
    strs[i] = strs[i].charAt(0).toUpperCase() + strs[i].slice(1);
  }
  return strs.join( ' ' );
}
