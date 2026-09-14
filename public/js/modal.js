// Modal Manager
const Modal = {
    create(id, content) {
        const html = `
            <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[20px] py-[40px] hidden">
                <div class="bg-white max-h-full w-full max-w-lg shadow-lg p-6 rounded-2xl flex flex-col overflow-y-auto overflow-x-hidden opacity-0 transition-opacity duration-200">
                    ${content}
                </div>
            </div>
        `;
        document.getElementById('modalsContainer').insertAdjacentHTML('beforeend', html);
    },

    open(id) {
        const modal = document.getElementById(id);
        modal.classList.remove('hidden');
        setTimeout(() => {
            const content = modal.querySelector('div > div');
            content.classList.remove('opacity-0');
            content.classList.add('opacity-100');
        }, 10);
    },

    close(id) {
        const modal = document.getElementById(id);
        const content = modal.querySelector('div > div');
        content.classList.remove('opacity-100');
        content.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    }
};

