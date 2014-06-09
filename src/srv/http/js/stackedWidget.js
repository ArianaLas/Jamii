/*
 *
 * Copyright (C) Jamii Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * Contributors:
 * -> Aleksander Gajos <alek.gajos@gmail.com>
 *  
 */


var StackedWidget = function(){
    
    this.widgets = [];
    this.buttons = [];
    this.count = 0;
    this.current = -1; 
    this.default_index = 0;
    
}

StackedWidget.prototype.index_by_button_name = function( button_name ){
    if( this.count < 1 ) return;
    for(var i=0;i<this.count;i++){
	if( this.buttons[i].getAttribute('id') == button_name ){
	    return i;
	}
    }
}

StackedWidget.prototype.index_by_widget_name = function( widget_name ){
    if( this.count < 1 ) return;
    for(var i=0;i<this.count;i++){
	if( this.widgets[i].getAttribute('id') == widget_name ){
	    return i;
	}
    }
}


StackedWidget.prototype.toggle = function( name ){
    console.log(name);
    var index = this.index_by_button_name( name );

    if( this.current == index ){ // if visible, show default
	this.set_current_widget_by_index( this.default_index );
    }else{ // if hidden, show
	this.set_current_widget_by_index( index );
    }
}

StackedWidget.prototype.add_widget = function( widget_name, button_name){
    
    var widget = document.getElementById( widget_name );
    var button = document.getElementById( button_name );
    this.widgets.push( widget );
    this.buttons.push( button );

    button.mother_stack = this;

    button.onclick = function(){
    	// window.stack.toggle( this.id );
    	this.mother_stack.toggle( this.id );
    }
    
    this.count++;
    widget.style.display = "none";
    this.set_current_widget_by_index[ this.count-1 ];
    return this.count-1;

}

StackedWidget.prototype.set_default = function( widget_name ){
    
    var index = this.index_by_widget_name( widget_name );

    if( index >= this.count ){
	return;
    }
    this.default_index = index;
    this.set_current_widget_by_index[ this.default_index ];
}

StackedWidget.prototype.set_current_widget_by_name = function( widget_name ){
    if( this.count < 1 ) return;
    for(var i=0;i<this.count;i++){
	if( this.widgets[i].getAttribute('id') == widget_name ){
	    this.set_current_widget_by_index( i );
	}
    }
}

StackedWidget.prototype.set_current_widget_by_index = function( widget_index ){
    if( this.count < 1 ) return;
    if( this.current >=0 ){
	this.widgets[ this.current ].style.display = "none";
    }
    this.widgets[ widget_index ].style.display = "block";
    this.current = widget_index;
}
