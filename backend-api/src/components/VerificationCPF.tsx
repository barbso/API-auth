function validarPrimeiroDigito(cpf: string | any[]) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += cpf[i] * (10 - i);
    }
    const resto = (sum * 10) % 11;
    if (resto < 10) {
      return cpf[9] == resto;
    }
    return cpf[9] == 0;
  }
  
  function validarSegundoDigito(cpf: string | any[]) {
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += cpf[i] * (11 - i);
    }
    const resto = (sum * 10) % 11;
    if (resto < 10) {
      return cpf[10] == resto;
    }
    return cpf[10] == 0;
  }
  
  function validarRepetido(cpf: string | any[]) {
    const primeiro = cpf[0];
    let diferente = false;
    for(let i = 1; i < cpf.length; i++) {
      if(cpf[i] != primeiro) {
        diferente = true;
      }
    }
    return diferente;
  }
  
   export function validatorCpf(cpf: string) {
    if (cpf.length != 11) {
      return false;
    }
    if(!validarRepetido(cpf)) {
      return false;
    }
    if (!validarPrimeiroDigito(cpf)) {
      return false;
    }
    if (!validarSegundoDigito(cpf)) {
      return false;
    }
    return true;
  }

