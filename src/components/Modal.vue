<template>
  <transition name="modal">
  <div class="modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-window">
        <div class="modal-content">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="emit('close')"></button>
          </slot>
        </footer>
    </div>
  </div>
  </transition>
</template>

<style>
.modal {
  display: flex;
  justify-content: center;
}
.modal-overlay {
  position: fixed;
  align-items: center;
  display: flex;
  justify-content: center;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  top: 25%;
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.modal-content {
  padding: 10px 20px;
}

.modal-footer { 
  background-color: #555;
  padding: 10px;
  text-align: right;
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}

</style>

