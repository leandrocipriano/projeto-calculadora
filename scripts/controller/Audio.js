class Audio {

  static toggleAudio(){
        
        //If condicional normal
        /*if(this._audioOnOff){
            this._audioOnOff = false;
        }else 
            this._audioOnOff = true;*/
        //If ternario
        //this._audioOnOff = (this._audioOnOff) ? false : true;
        //If ternario resumido
        this._audioOnOff = !this._audioOnOff;
    }

   static playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    
    static stopAudio(){

       if(!this._audioOnOff){
           this._audio.currentTime = 0;
           this._audio.stop();
       }
    }

}
