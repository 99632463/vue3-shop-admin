import { ref, reactive } from "vue";
import { logout, updatePassword } from "~/api/manager";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useRepassword() {
  const router = useRouter();
  const store = useStore();

  const formDrawerRef = ref(null);
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const updatePwdSubmit = () => {
    formDrawerRef.value.setLoading(true);
    updatePassword(form)
      .then((res) => {
        store.dispatch("logout");
        router.push("/login");
      })
      .finally(() => {
        formDrawerRef.value.setLoading(false);
      });
  };
  const openRepasswordForm = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    form,
    updatePwdSubmit,
    openRepasswordForm
  }
}

export function userLogout() {
  const router = useRouter();
  const store = useStore();
  
  const handleLogout = () => {
    logout().then(() => {
      store.dispatch("logout").then((res) => {
        router.push("/login");
      });
    });
  }
  
  return {
    handleLogout
  }
}