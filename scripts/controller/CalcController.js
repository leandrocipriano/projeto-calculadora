//Classe é um conjuto de atribuos e métodos
class CalculatorController{
    
    constructor(){
        
        //var displayCalc = "0";
        //var dataAtual;

        //variavel para validar audio ligado ou desligado
        this._audioOnOff = false;
        this._audio = new Audio("click.mp3");

        //variáveis em clases são this para se comportarem como objetos
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalc = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._locale = 'pt-BR';
        
        this.initalize();
        this.initButtonsEvents();
        this.iniKeyboard();
        
        //encapsulamento public, protected e private (só atributos e métodos da mesma classe permite leitura)
        //Private no JavaScript
        //"_" adicionar o underline
        //this._displayCalc = "0";
        //this._dataAtual;

        //dir(document)
        //para exibir os elementos do documento como objetos
        
    }


    copyToClipboard(){
        
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        //O comando Copy irá copiar tudo selecionado
        document.execCommand("Copy");

        //Ocultar o campo input
        input.remove();

    }

    pastFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            
            this.displayCalc = parseFloat(text);

            //console.log(text);
        });

    }

    initalize(){

        //arrow function
        //()=>{}
        //normal function
        //function(){};

        this.setDisplayDateTime();
        //setInterval está rodando as funções a cada 1s, o parametro está em ms (por isto, 1000).
        setInterval(()=>{

            this.setDisplayDateTime();
            
        }, 1000);

        

        //setTimeout para parar o interval
        /*setTimeout(()=>{
            clearInterval(interval);
        }, 10000);*/

        /*let displayCalcEl = document.querySelector("#display");
        let dateCalcEl = document.querySelector("#data");
        let timeCalcEl = document.querySelector("#hora");
        */
        //Dica: para pegar as propriedades e métodos de uma função, utilizar di(funcao), por exemplo,
        // di(Date) no console
        //this._dataEl.innerHTML = "06/08/2019";
        //this._timeEl.innerHTML = "00:22";

        this.setLastNumberToDisplay();

        this.pastFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            //Adicionar um listner para identificar double click (dblclick)
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });

        });
    }

    toggleAudio(){
        
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

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    iniKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();
            //console.log(e.key);

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                
                case 'c':
                    //Identificar que o C foi pressionado com o Ctrl
                    if (e.ctrlKey){
                        this.copyToClipboard();
                    }
                    break;
            }

        });

    }

    setDisplayDateTime(){
        
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);

        //formatando cada campo
        /*this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day:"2-digit", 
            month:"long", 
            year:"numeric"
        });
        */

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //Método para permitir vários eventos ao addEventListener
    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);

        });


    }

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        //Atualizar Display
        this.setLastNumberToDisplay();

    }

    cancelEntry(){
        //pop tira o último item do array
        this._operation.pop();
         
        //Atualizar Display
        this.setLastNumberToDisplay();
    }

    setError(){

        this.displayCalc = "ERROR";
    }

    getLastOperation(){

       return this._operation[this._operation.length - 1];

    }

    //Retorna o operador anterior
    setLastOperation(inputValue){

        this._operation[this._operation.length - 1] = inputValue;
    }

    isOperator(value){
        
        //como o retorno da condição é um true/false não é preciso fazer passa como return direto
        //indexOf vai buscar se o valor passado está no array
        /*if(['+', '-', '*', '%','/'].indexOf(value) > -1){
            return true;
        }else{
            return false;
        }*/
        return (['+', '-', '*', '%','/'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        
        try{

            //console.log('getResult', this._operation);
            return eval(this._operation.join(""));

        }catch(e){
            //Executa o método após 1 segundo
            setTimeout(()=>{
                this.setError();
            }, 1);
            
        }        
    }
    
    // inserção metodo geracao metrica waydev
    aspone(){
        let a=1;
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }else if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false );

        }
         
        //console.log('_lastOperator', this._lastOperator);
        //console.log('_lastNumber', this._lastNumber); 
        //[10,"+",90].toString() = "10,+,90";
        //[10,"+",90].join("") = "10+90";
        //eval([10,"+",90].join("")) = "100";
        let result = this.getResult();

        result = this.calcMod(last, result);
            

        //Atualizar Display
        this.setLastNumberToDisplay();
    }

    calcMod(last, result) {
        if (last == '%') {
            result /= 100;
            this._operation = [result];
        }
        else {
            this._operation = [result];
            if (last)
                this._operation.push(last);
        }
        return result;
    }
   

    getLastItem(isOperator = true){

        let lastItem = 0;
        for(let i = this._operation.length-1; i >= 0; i--){
            
           if(this.isOperator(this._operation[i]) == isOperator ){
                lastItem = this._operation[i];
                break;
           }   
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }
 
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){

        //console.log('A', this.getLastOperation(), isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){
            //String
            if(this.isOperator(value)){

                //trocar Operador
                this.setLastOperation(value);

            }  else{

                this.pushOperation(value);  

                //Atualizar Display
                this.setLastNumberToDisplay();              
            }
        } else{
            if(this.isOperator(value)){

                this.pushOperation(value); 

            }else{

                //Number
                let newValue = this.getLastOperation().toString() + value.toString();
               
                //push adiciona um novo item no final do array
                this.setLastOperation(newValue);

                //Atualizar Display
                this.setLastNumberToDisplay();
            }
           
        }

        //console.log(this._operation);
    }

    addDot(){

      
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1){
            return;
        }
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

        console.log('lastOperation ', lastOperation); 

    }

    execBtn(value){
        
        //ao clicar em qualquer tecla, será executado o audio
        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
             case 'ponto':
                this.addDot();
                break;
                
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){
        //querySelector retornará apenas a primeira consulta (buttons) e não retorna a segunda
        //document.querySelector("#buttons > g, #parts > g");

        //querySelectorAll retornará todas as consultas que solicitamos buttons e parts
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            
            //método padrão que funciona somente com uma ação "click"
            /*btn.addEventListener('click', e=>{

                console.log(btn.className.baseVal.replace("btn-",""));
            });*/

            //método criado para atender mais de uma função
            this.addEventListenerAll(btn, "click drag", e=>{

                let txtBtn = btn.className.baseVal.replace("btn-","");
                
                this.execBtn(txtBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";
            
            });
        });

        //botão 9 - função unica
        /*
        let button9 = document.querySelector("#buttons > g.btn-9");
        button9.addEventListener('click', e=>{
            console.log(e);
        });
        */
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    get displayCalc(){
        return this._displayCalc.innerHTML;
    }

    set displayCalc(value){

        //Converter para toString para validar o dado 
        //pelo tamanho da string para evitar problema no resultado de uma equação
        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalc.innerHTML = value; 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    validateNewWork() {
        console.log('New Work in WayDev'); 
    }

    validateNewWorkR() {
        //Criado o método para validar o fluxo de pair review 
        //console.log('Trying churn in waydev at 22/01/2020 11:40');
        //console.log('Trying churn in waydev in the afternoon 23/01/2020 18:07');
        console.log('Trying churn in waydev in the afternoon 23/01/2020 18:07');
    }

}
