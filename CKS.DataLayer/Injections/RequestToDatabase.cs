using System;
using System.Globalization;
using Omu.ValueInjecter;

namespace CKS.DataLayer.Injections
{
    public class RequestToDatabase : ConventionInjection
    {
        protected override bool Match(ConventionInfo c)
        {
            var result = c.SourceProp.Name == c.TargetProp.Name &&
                          c.Target.Type.GetProperty(c.TargetProp.Name.ToString(CultureInfo.InvariantCulture)).GetGetMethod().IsVirtual == false;
            return result;
        }
        protected override object SetValue(ConventionInfo c)
        {
            if (c.SourceProp.Name.ToString(CultureInfo.InvariantCulture) == "LastModifiedDate" ||
                c.SourceProp.Name.ToString(CultureInfo.InvariantCulture) == "CreatedDate" ||
                c.SourceProp.Name.ToString(CultureInfo.InvariantCulture) == "Id"
                 )
            {
                return c.TargetProp.Value;
            }
            return c.SourceProp.Value;
        }
    }
}
