let components;

export default function (req, res) {
  let app     = req.app,
      context = app.context,
      name    = req.params.name;

  if (!components) {
    components = context.config('the components');
  }

  components.some((cmp, i) => {
    let desc = cmp.description;

    if (cmp.on && !cmp.hidden) {
      if (desc.name == name) {
        if (cmp.api) {
          req.component = cmp;

          cmp.api(req, res);

          return true;
        }
      }
    }
  })
  
}