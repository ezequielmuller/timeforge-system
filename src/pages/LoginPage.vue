<template>
  <q-page class="row full-height">
    <!-- LADO ESQUERDO - FORMULÁRIO -->
    <div class="col-12 col-md-6 flex flex-center bg-white">
      <div class="login-card">
        <div class="text-h4 text-primary text-weight-bold q-mb-sm">Bem-vindo</div>
        <div class="text-grey-7 q-mb-lg">Faça login para continuar</div>

        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          dense
          color="primary"
          class="q-mb-none"
          :rules="[(val) => !!val || 'Informe o email']"
        />

        <q-input
          v-model="senha"
          label="Senha"
          :type="mostrarSenha ? 'text' : 'password'"
          outlined
          dense
          color="primary"
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Informe a senha']"
        >
          <template v-slot:append>
            <q-icon
              :name="mostrarSenha ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <q-toggle
          label="Lembrar minha senha?"
          color="primary"
          class="q-mb-sm"
          dense
          v-model="lembrarSenha"
        />

        <q-btn
          label="Entrar"
          type="submit"
          color="primary"
          class="full-width q-mt-sm"
          unelevated
          @click="login"
        />
      </div>
    </div>

    <!-- LADO DIREITO - IMAGEM / DESTAQUE -->
    <div class="col-12 col-md-6 bg-primary flex flex-center side-image">
      <div class="text-white text-h5 text-weight-medium text-center q-pa-xl">
        <q-img src="/public/logo.png" style="width: 40px; height: 40px"></q-img>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const senha = ref('')
const lembrarSenha = ref()
const mostrarSenha = ref(false)

const login = () => {
  console.log('Email:', email.value)
  console.log('Senha:', senha.value)
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* Esconde o lado direito no mobile */
@media (max-width: 767px) {
  .side-image {
    display: none;
  }
}
</style>
