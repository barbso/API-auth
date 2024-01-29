export function maskCpf(cpf: string){
    return cpf
        .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
}

export function maskTelefone(telefone: string){
 return telefone
    .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }


