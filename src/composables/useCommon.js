import { ref, reactive, computed } from "vue";

// 列表、分页、搜索、删除
export const useInitTable = (opt) => {
  // const searchForm = reactive({
  //   keyword: "",
  // });
  // const resetSearchForm = () => {
  //   searchForm.keyword = "";
  //   getData();
  // };
  let searchForm = null
  let resetSearchForm = null
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm })
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key]
      }
      getData()
    }
  }

  let tableData = ref([]);
  let loading = ref(false);
  // pagination
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);
  // const roles = ref([])

  function getData(p = null) {
    if (typeof p === "number") {
      currentPage.value = p;
    }

    loading.value = true;
    opt.getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess) {
          opt.onGetListSuccess(res)
        } else {
          tableData.value = res.list
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  const handleDelete = (id) => {
    loading.value = true;
    opt.delete(id)
      .then((res) => {
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleStatusChange = (status, row) => {
    row.statusLoading = true
    opt.updateStatus(row.id, status)
      .then(res => {
        row.status = status
      }).finally(() => {
        row.statusLoading = false
      })
  }

  const mutiSelectionIds = ref([])
  const handleSelectionChange = e => {
    mutiSelectionIds.value = e.map(o => o.id)
  }

  const tableRef = ref(null)
  const handleMultiDelete = () => {
    loading.value = true
    opt.delete(mutiSelectionIds.value)
      .then(res => {
        // clear selection
        if(tableRef.value){
          tableRef.value.clearSelection()
        }
        getData()
      }).finally(() => {
        loading.value = false
      })
  }

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    tableRef,
    handleMultiDelete
  }
}

// 新增，修改
export const useInitForm = (opt) => {
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const defaultFormData = opt.form
  let form = reactive({...defaultFormData});
  const editId = ref(0);
  const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

  const handleSubmit = () => {
    formDrawerRef.value.setLoading(true);

    const func = editId.value
      ? opt.update(editId.value, form)
      : opt.create(form);

    func
      .then((res) => {
        opt.getData(editId.value ? false : 1);
        formDrawerRef.value.close();
      })
      .finally(() => {
        formDrawerRef.value.setLoading(false);
      });
  };
  // 新增
  const handleCreate = () => {
    editId.value = 0;
    for (const key in defaultFormData) {
      form[key] = defaultFormData[key]
    }
    formDrawerRef.value.open();
  };

  const handleEdit = (row) => {
    formDrawerRef.value.open();
    editId.value = row.id;

    for (const key in row) {
      form[key] = row[key]
    }
  };

  return {
    formDrawerRef,
    formRef,
    form,
    editId,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
  }
}