<template>
  <q-page class="row full-height" style="min-height: 100vh">
    <!-- LADO ESQUERDO - FORMULÁRIO -->
    <div class="col-12 col-md-5 flex flex-center bg-white">
      <div class="login-card q-pa-xl">
        <!-- Logo badge -->
        <div class="q-mb-lg">
          <div class="logo-badge bg-primary flex flex-center">
            <q-icon name="waving_hand" color="white" size="md"> </q-icon>
          </div>
        </div>

        <div class="text-h4 text-weight-bold text-dark q-mb-xs" style="letter-spacing: -1px">
          Bem‑vindo
        </div>
        <div class="text-body2 text-grey-7 q-mb-xl">Entre com suas credenciais para continuar</div>

        <!-- Email -->
        <div class="q-mb-md">
          <div
            class="text-caption text-grey-7 q-mb-xs"
            style="letter-spacing: 0.06em; text-transform: uppercase"
          >
            Email
          </div>
          <q-input
            v-model="email"
            placeholder="seu@email.com"
            type="email"
            outlined
            dense
            color="primary"
            bg-color="grey-1"
            :rules="[(val) => !!val || 'Informe o email']"
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email" size="18px" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- Senha -->
        <div class="q-mb-sm">
          <div
            class="text-caption text-grey-7 q-mb-xs"
            style="letter-spacing: 0.06em; text-transform: uppercase"
          >
            Senha
          </div>
          <q-input
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            outlined
            dense
            color="primary"
            bg-color="grey-1"
            :rules="[(val) => !!val || 'Informe a senha']"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" size="18px" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="mostrarSenha ? 'visibility' : 'visibility_off'"
                class="cursor-pointer text-grey-4"
                size="18px"
                @click="mostrarSenha = !mostrarSenha"
              />
            </template>
          </q-input>
        </div>

        <!-- Lembrar + Esqueci -->
        <div class="row items-center justify-between q-mb-xl">
          <q-toggle v-model="lembrarSenha" label="Lembrar‑me" color="primary" dense />
          <a
            href="#"
            class="text-primary text-caption text-weight-medium"
            style="text-decoration: none"
          >
            Esqueci a senha
          </a>
        </div>

        <!-- Botão entrar -->
        <q-btn
          label="Entrar"
          color="primary"
          class="full-width q-mb-md"
          style="border-radius: 15px !important"
          unelevated
          size="lg"
          @click="login"
        >
          <q-icon name="arrow_forward" class="q-ml-sm" size="18px" />
        </q-btn>
      </div>
    </div>

    <!-- LADO DIREITO - VISUAL -->
    <div class="col-md-7 gt-sm visual-side bg-secondary relative-position overflow-hidden">
      <!-- Círculos decorativos -->
      <div class="circle circle-1 bg-primary"></div>
      <div class="circle circle-2 bg-primary"></div>
      <div class="circle circle-3 bg-white"></div>

      <!-- Grid overlay -->
      <div class="grid-overlay absolute-full"></div>

      <!-- Conteúdo central -->
      <div class="absolute-full flex flex-center column text-center q-px-xl">
        <!-- <q-icon name="rocket_launch" size="56px" color="primary" class="q-mb-lg" /> -->
        <q-img src="/public/logosfundo.png" style="width: 300px"></q-img>
        <div class="text-white text-weight-bold q-mb-md visual-headline">
          Gerencie seus horários<br />
          <span class="text-white">em um só lugar!</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const rota = useRouter()

const email = ref('')
const senha = ref('')
const lembrarSenha = ref(false)
const mostrarSenha = ref(false)

const login = async () => {
  console.log('login chamado')
  await rota.push('/home')
}
</script>

<style scoped>
/* ── Formulário ──────────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.06);
}

.logo-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* ── Visual side ─────────────────────────────────── */
.visual-side {
  min-height: 100vh;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}
.circle-1 {
  width: 380px;
  height: 380px;
  top: -100px;
  right: -80px;
  opacity: 0.22;
  animation: drift 8s ease-in-out infinite alternate;
}
.circle-2 {
  width: 260px;
  height: 260px;
  bottom: -60px;
  left: -40px;
  opacity: 0.18;
  animation: drift 10s ease-in-out infinite alternate-reverse;
}
.circle-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.04;
  animation: drift 6s ease-in-out infinite alternate;
}

@keyframes drift {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(28px, 18px);
  }
}

.grid-overlay {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 14px 20px;
  z-index: 2;
  animation: floatY 4s ease-in-out infinite alternate;
}
.card-top {
  top: 48px;
  right: 40px;
  animation-delay: 0s;
}
.card-bottom {
  bottom: 48px;
  left: 40px;
  animation-delay: 1.5s;
}

@keyframes floatY {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
}

.visual-headline {
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.2;
  letter-spacing: -1.5px;
}

@media (max-width: 767px) {
  .login-card {
    box-shadow: none;
    padding: 24px !important;
  }
}
</style>
