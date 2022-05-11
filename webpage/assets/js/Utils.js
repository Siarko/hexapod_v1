function debug(...data){
    if(MODE === 'dev'){
        console.debug(...data);
    }
}