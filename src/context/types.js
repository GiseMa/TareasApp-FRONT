

//Los types son para que el reducer sepa que accion debe ejecutar.
//Lo que se hace es que se compara el type que se envia desde el dispatch de la funcion 
//con el del reducer. Si no son iguales, no pasa anda
//Son identificadores de acciones
//El puente entre lo que quiero hacer y el codigo que cambia el estado

export const types = {
    login: '[AUTH] Login',
    logout: '[AUTH] Logout',
    register: '[AUTH] Register',
    errorAuth: '[AUTH] Error auth',
    clearErrorAuth: '[AUTH] Clear error',
    clearRegister: '[AUTH] Clear register',
    finishChecking: '[AUTH] Finish checking',

    loadTasks: '[TASK] Load task',
    saveTask : '[TASK] Save task',
    updateTask: '[TASK] Update task',
    deleteTask: '[TASK] Delete task',
    isLoadingTask: '[TASK] Loading task',
    errorTask : '[TASK] Error task',
    resetTasks : '[TASK] Reset task',
    loadFilters : '[TASK] Load filters',
    saveActualFilters : '[TASK] Save filters',

    openModal: '[UI] Open Modal',
    closeModal: '[UI] Close Modal',
}
