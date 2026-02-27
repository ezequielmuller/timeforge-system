const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'consulta-horarios', component: () => import('pages/ConsultarHorariosPage.vue') },
      {
        path: 'cadastros/professores',
        component: () => import('pages/cadastros/CadastroProfessoresPage.vue'),
      },
      {
        path: 'cadastros/disciplinas',
        component: () => import('pages/cadastros/CadastroDisciplinasPage.vue'),
      },
      {
        path: 'admin/configuracoes',
        component: () => import('pages/admin/AdminConfiguracoesPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
