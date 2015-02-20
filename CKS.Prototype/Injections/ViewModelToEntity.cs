using System;
using System.Globalization;
using Omu.ValueInjecter;

namespace CKS.Prototype.Injections
{
    public class ViewModelToEntity : ConventionInjection
    {
        protected override bool Match(ConventionInfo c)
        {
            var result = c.SourceProp.Name == c.TargetProp.Name &&
                          c.Target.Type.GetProperty(c.TargetProp.Name.ToString(CultureInfo.InvariantCulture)).GetGetMethod().IsVirtual == false;
            return result;
        }
        protected override object SetValue(ConventionInfo c)
        {
            if (c.SourceProp.Name.ToString(CultureInfo.InvariantCulture) == "LastModifiedDate")
            {
                return DateTime.Now;
            }
            if (c.SourceProp.Name.ToString(CultureInfo.InvariantCulture) == "CreatedDate")
            {
                dynamic value = c.Source.Value;
                if (value.Id == null)
                {
                    return DateTime.Now;
                }
                return c.TargetProp.Value;
            }
            return c.SourceProp.Value;
        }
    }
}
