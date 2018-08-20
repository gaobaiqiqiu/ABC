#!/usr/bin/python

import os, sys
import operator
import os.path

root = os.getcwd();

fo = open("configPin.js", "w");

fo.write( "var fileListPin = {" );
def find( path, dir ):
    
    currPath = root;

    if( operator.eq(root, "") != True ):
        currPath = currPath + "/" + path;
        

    if( operator.eq(dir, "") != True ):
        currPath = currPath + "/" + dir;
        fo.write( dir + ":[" );
    
    print( "in dir: " + currPath );
    listdir = os.listdir( currPath );
    for item in listdir:
        subpath = currPath + "/" + item;
        if( os.path.isfile( subpath ) ):
            print( "file: " + subpath )
            if( operator.eq(dir, "") ):
                continue;
            fo.write( "\"" + item + "\"" );
        elif( os.path.isdir( subpath ) ):
            find( path + "/" + dir, item );
        if( len(listdir) != listdir.index(item) + 1 ):
            fo.write(", ");

    if( operator.eq(dir, "") != True ):
        fo.write( "]" );

find( "", "" );

fo.write( "};" );
fo.close();

